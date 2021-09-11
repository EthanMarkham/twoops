import { SocketListener, SocketAPI } from './webSocket';
import { TwitchBot, ChatListener } from './twitchBot';
import { Collection, ObjectId } from 'mongodb';
import { MongoAPI } from './mongoAPI'
import GameSetting, { ChatSettings } from '../models/gameSettings';
import RoundInfo, { getRandomPosition } from '../models/roundInfo';
import { Triplet } from '@react-three/cannon';

const mongoAPI: MongoAPI = require('./mongoApi');
const socketAPI: SocketAPI = require('./webSocket');
const twitchBOT: TwitchBot = require('./twitchBot');

//INTERFACE
export interface RoundResponse {
    round: RoundInfo,
    new: boolean
}
export interface SettingsResponse {
    settings: GameSetting,
    new: boolean
}
export interface ShotInfo {
    user: string,
    shot: {
        x: number,
        y: number,
        z: number
    }
}
export interface ShotResult {
    user: string,
    throw: {
        x: number,
        y: number,
        z: number
    },
    result: string
}
export interface RoundResponse {
    round: RoundInfo,
    new: boolean
}
export interface SettingsResponse {
    settings: GameSetting,
    new: boolean
}
export interface AggregatedResponse {
    settings: GameSetting,
    roundInfo: RoundInfo
    newUser?: boolean,
}
export interface GameManager {
    pendingShots: Map<string, PendingShot>
    delayedGames: string[],
    addListeners: () => void,
    getSettings: (user: string) => Promise<SettingsResponse>,
    getAggregatedData: (user: string) => Promise<AggregatedResponse>
    logResult: (channel: string, shot: ShotResult) => Promise<LoggedShotResponse>
}
export interface PendingShot {
    shot: ShotInfo,
    channel: string,
    roundID: ObjectId | undefined,
    chat?: string,
}
export interface LoggedShotResponse {
    hoopPosition: Triplet,
    attempts: number,
    roundID: ObjectId
}

//CONSTANTS
const HELP_MSG: string = "Please enter !shot followed by x, y, z [1-100].";

const shotConversions: Triplet = [15, 40, 3];

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
            shot: shotConverter([x, y, z], shotConversions)
        }
    }
}
const shotConverter = (shot: Triplet, shotConversions: Triplet): { x: number, y: number, z: number } => ({
    x: shot[0] / 100 * shotConversions[0],
    y: shot[1] / 100 * shotConversions[1],
    z: shot[2] / 100 * shotConversions[2]
})
const getResponseMessage = (chat: ChatSettings, round: RoundInfo, result: ShotResult): string => {
    let msg = "";
    if (result.result == "SUCCESS") {
        msg = chat.bucketResponse;
        if (round.shots.length == 1) msg += chat.firstTryMessage;
    }
    else {
        msg = result.result == "AIRBALL" ? chat.airballResponse : chat.brickResponse;
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
                    if (settings.chat.responseEnabled && roundInfo.inProgress && !gameManager.delayedGames.includes(channel)) twitchBOT.say(settings.chat.inProgressMessage.replace('@user', `@${user}`), channel);
                    else {
                        //EMIT SOCKET INFO
                        if (!socketAPI.io) throw new Error("No socket connection.");
                        socketAPI.io.to(`twoops-${channel}`).emit('NEW_SHOT', shot);

                        //add to pending shots
                        let pendingShot: PendingShot = {
                            shot: shot,
                            channel: channel,
                            roundID: roundInfo._id,
                        }

                        if (settings.chat.responseEnabled) pendingShot.chat = settings.chat.shotAcknowledged.replace('@user', `@${user}`);
                        gameManager.pendingShots.set(channel, pendingShot);
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
        let pendingShot: PendingShot | undefined = gameManager.pendingShots.get(channel);

        if (!pendingShot) throw new Error("Registering shot for channel that does not exist.");
        if (!pendingShot.roundID) throw new Error("Registering shot for round that does not exist.");

        if (pendingShot.chat) twitchBOT.say(pendingShot.chat, channel);

        if (mongoAPI.db == null) throw new Error("No database Connection");
        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').updateOne({ _id: pendingShot.roundID }, { $set: { inProgress: true } });

        gameManager.pendingShots.delete(channel);
        //setTimeout(() => gameManager.setInProgress(channel, false), 60000)
    }
};

//DEFAULT EXPORT
const gameManager: GameManager = module.exports = {
    pendingShots: new Map<string, PendingShot>(),
    delayedGames: [],
    addListeners: () => {
        //add socket listeners
        socketAPI.addListener(joinListener);
        socketAPI.addListener(leaveListener);
        socketAPI.addListener(acknowledgeShotListener);

        //add chatbot listeners
        twitchBOT.addListener(chatShotListener);
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
    getAggregatedData: (channel: string): Promise<AggregatedResponse> => {
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
                { $match: { channel: channel } },
                { $limit: 1 },
            ]).toArray().then(data => {
                let roundInfo: RoundInfo;
                let settings: GameSetting;
                let newUser: boolean = false;

                if (data.length != 0) settings = data[0] as any as GameSetting;
                else {
                    console.log('creating new settings for ' + channel);
                    settings = new GameSetting(channel);

                    if (mongoAPI.db == null) throw new Error("No database Connection");
                    mongoAPI.db.collection(process.env.SETTINGS_COLLECTION_NAME || 'settings').insertOne(settings);
                    newUser = true;
                }

                if (data[0] && data[0].roundInfo.length != 0) roundInfo = data[0].roundInfo[0];
                else {
                    console.log('Creating new round for ' + channel);
                    roundInfo = new RoundInfo(channel, settings.hoopsSpawn);

                    if (mongoAPI.db == null) throw new Error("No database Connection");
                    mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').insertOne(roundInfo);
                };

                resolve({ settings: settings, roundInfo: roundInfo, newUser: newUser });
            })
        });
    },
    logResult: (channel: string, shot: ShotResult): Promise<LoggedShotResponse> => {
        if (!shot) throw new Error("Missing shot info");

        return new Promise<LoggedShotResponse>((resolve) => {
            gameManager.getAggregatedData(channel)
                .then(({ settings, roundInfo }) => {
                    if (mongoAPI.db == null) throw new Error("No database Connection");
                    gameManager.delayedGames.push(channel);

                    //add extra delay for twitch chat commands
                    setTimeout(() => {
                        twitchBOT.say(getResponseMessage(settings.chat, roundInfo, shot), channel);

                        const index = gameManager.delayedGames.indexOf(channel);
                        if (index > -1) gameManager.delayedGames = gameManager.delayedGames.splice(index, 1);
                    }, settings.chat.delay);

                    if (shot.result == "SUCCESS") {
                        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').updateOne(
                            { channel: channel, isComplete: false },
                            {
                                $push: { shots: shot },
                                $set: { inProgress: false, isComplete: true }
                            }
                        );
                        roundInfo = new RoundInfo(channel, settings.hoopsSpawn);
                        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').insertOne(roundInfo)
                            .then(result => {
                                resolve({
                                    hoopPosition: roundInfo.hoopLocation,
                                    attempts: 0,
                                    roundID: result.insertedId
                                });
                            })
                    }
                    else {
                        mongoAPI.db.collection(process.env.ROUND_COLLECTION_NAME || 'roundinfo').updateOne(
                            { channel: channel, isComplete: false },
                            {
                                $push: { shots: shot },
                                $set: { inProgress: false }
                            }
                        );
                        if (roundInfo._id == null) throw new Error("Missing round id.")
                        resolve({
                            hoopPosition: roundInfo.hoopLocation,
                            attempts: roundInfo.shots.length + 1,
                            roundID: roundInfo._id
                        });
                    }


                })
        })

    }
}
