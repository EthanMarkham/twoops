import { SocketListener, SocketAPI } from '../webSocket';
import { ShotResult, ShotInfo, RoundResponse, SettingsResponse, ResultStatus, Triplet, GameManager, AggregatedResponse } from './types';
import { TwitchBot, ChatListener } from '../twitchBot';
import { Collection } from 'mongodb';
import { MongoAPI } from '../mongoApi'
import GameSetting from '../mongoApi/models/gameSettings';
import RoundInfo from '../mongoApi/models/roundInfo';

const mongoAPI: MongoAPI = require('../mongoApi');
const socketAPI: SocketAPI = require('../webSocket');
const twitchBOT: TwitchBot = require('../twitchBot');

//CONSTANTS
const HELP_MSG: string = "Please enter !shot followed by x, y, z [1-100].";
const shotConversions: Triplet = {
    x: 15,
    y: 40,
    z: 3,
}

//UTILS
const getShot = (user: string, commands: string[]): ShotInfo | false => {
    if (commands.length < 4) return false;
    else {
        let x = parseFloat(commands[1]);
        let y = parseFloat(commands[2]);
        let z = parseFloat(commands[3]);
        if (x === NaN || y == NaN || z == NaN) return false;
        return {
            user: user,
            shot: shotConverter({ x, y, z }, shotConversions)
        }
    }
}

const shotConverter = (shot: Triplet, shotConversions: Triplet): { x: number, y: number, z: number } => ({
    x: shot.x / 100 * shotConversions.x,
    y: shot.y / 100 * shotConversions.y,
    z: shot.z / 100 * shotConversions.x
})

const getResponseMessage = (settings: GameSetting, round: RoundInfo, result: ShotResult): string => {
    let msg = "";
    if (result.result == ResultStatus.SUCCESS) {
        msg = settings.chat.bucketResponse;
        if (round.shots.length == 1) msg += settings.chat.firstTryMessage;
    }
    else {
        msg = result.result == ResultStatus.AIRBALL ? settings.chat.airballResponse : settings.chat.brickResponse;
        for (let i = 0; i < Math.random() * 5; i++) msg += '!';
    }
    return msg;
}


//LISTENERS
const chatShotListener: ChatListener = {
    command: "!shot",
    callback: (channel: string, tags: any, commands: string[]) => {
        const user: string | null = tags["display-name"] ? tags["display-name"] : null;
        channel = channel.slice(1);

        if (!user) throw new Error("Error. Lost username?");

        gameManager.getAggregatedData(channel)
            .then(({ settings, roundInfo }: AggregatedResponse) => {
                let shot: ShotInfo | boolean = getShot(user, commands);

                if (!shot) twitchBOT.say(HELP_MSG, user);
                else {
                    if (settings.chat.responseEnabled && roundInfo.inProgress) twitchBOT.say(settings.chat.inProgressMessage.replace('@user', `@${user}`), channel);
                    else {
                        //EMIT SOCKET INFO
                        if (!socketAPI.io) throw new Error("No socket connection.");
                        socketAPI.io.to(`twoops-${channel}`).emit('NEW_SHOT', shot);

                        //CHAT RESPONSE
                        if (settings.chat.responseEnabled) twitchBOT.say(settings.chat.shotAcknowledged.replace('@user', `@${user}`), channel);

                        //UPDATE ROUND INFO
                        if (mongoAPI.db == null) throw new Error("No database Connection");
                        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').updateOne({ _id: roundInfo._id }, { $set: { inProgress: true } });
                    }
                }
            })
    }
};
const joinListener: SocketListener = {
    event: "JOIN_CHANNEL",
    callable: (socket, channel: string) => socket.join(`twoops-${channel}`)
};
const leaveListener: SocketListener = {
    event: "LEAVE_CHANNEL",
    callable: (socket, channel: string) => {
        socket.leave(channel);
        //gameManager.games.delete(channel);
    }
};
const acknowledgeShotListener: SocketListener = {
    event: "ACKNOWLEDGED_SHOT",
    callable: (_, channel: string) => {
        console.log('acknowledged shot for ' + channel);
        //setTimeout(() => gameManager.setInProgress(channel, false), 60000)
    }
};

const gameManager: GameManager = module.exports = {
    addListeners: () => {
        //add socket listeners
        socketAPI.addListener(joinListener);
        socketAPI.addListener(leaveListener);
        socketAPI.addListener(acknowledgeShotListener);

        //add chatbot listeners
        twitchBOT.addListener(chatShotListener);
    },
    getRound: (user: string): Promise<RoundResponse> => {
        return new Promise((resolve, reject) => {
            if (mongoAPI.db == null) throw new Error("No database Connection");

            let newRound = false;
            let roundInfoCollection: Collection = mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo');

            roundInfoCollection.findOne({ channel: user, isComplete: false })
                .then((roundInfo: any) => {
                    if (!roundInfo) {
                        console.log('Creating new round for ' + user);
                        roundInfo = new RoundInfo(user);
                        roundInfoCollection.insertOne(roundInfo);
                        newRound = true;
                    }
                    resolve({
                        round: roundInfo,
                        new: newRound,
                    })
                });
        })
    },
    getSettings: (user: string): Promise<SettingsResponse> => {
        return new Promise((resolve) => {
            if (mongoAPI.db == null) throw new Error("No database Connection");

            let newSettings = false;
            let settingsCollection: Collection = mongoAPI.db.collection(process.env.SETTINGS_COLLECTION_NAME || 'settings');

            settingsCollection.findOne({ channel: user })
                .then((settings: any) => {
                    //create new settings if none and mark new user
                    if (!settings) {
                        console.log('Creating new settings for ' + user);
                        settings = new GameSetting(user);
                        settingsCollection.insertOne(settings);
                        newSettings = true;
                    }
                    resolve({
                        settings: settings,
                        new: newSettings,
                    })

                })
        })
    },
    getAggregatedData: (user: string): Promise<AggregatedResponse> => {
        return new Promise((resolve) => {
            if (mongoAPI.db == null) throw new Error("No database Connection");

            let settingsCollection: Collection = mongoAPI.db.collection(process.env.SETTINGS_COLLECTION_NAME || 'settings');
            settingsCollection.aggregate([
                {
                    $lookup:
                    {
                        from: process.env.ROUND_COLLECTION_NAME || 'roundInfo',
                        localField: 'channel',
                        foreignField: 'channel',
                        as: 'roundInfo',
                        pipeline: [{
                            $match: { isComplete: false }
                        }]
                    }
                },
                { $match: { channel: user } },
                { $limit: 1 },
            ]).toArray().then(data => {
                if (data.length == 0) throw new Error("No game data found?");
                let roundInfo: RoundInfo;
                let settings: GameSetting = data[0] as any as GameSetting;

                if (data[0].roundInfo.length == 0) {
                    console.log('Creating new round for ' + user);
                    roundInfo = new RoundInfo(user);

                    if (mongoAPI.db == null) throw new Error("No database Connection");
                    mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').insertOne(roundInfo);
                }
                else roundInfo = data[0].roundInfo[0];

                resolve({ settings: settings, roundInfo: roundInfo });
            })
        });
    },
    logResult: (channel: string, shot: ShotResult): void => {
        if (mongoAPI.db == null) throw new Error("No database Connection");
        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').updateOne(
            { channel: channel, isComplete: false },
            {
                $set: { inProgress: false, isComplete: shot.result == ResultStatus.SUCCESS },
                $addToSet: { shots: shot }
            })
    }
}
