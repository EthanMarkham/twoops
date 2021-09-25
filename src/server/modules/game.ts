//Feel like this file is breaking SRP. Planning to redesign.


import { SocketAPI } from "./webSocket";
import { TwitchBot } from "./twitchBot";
import { Collection, ObjectId } from "mongodb";
import GameSetting from "../models/gameSettings";
import RoundInfo from "../models/roundInfo";
import {
    ShotResult,
    AggregatedResponse,
    PendingShot,
    GameManager,
    SettingsInfoResponse,
    LoggedShotResponse,
} from "../types/game";
import { getResponseMessage } from "../utils";
import { MongoAPI } from "../types/mongo";

const mongoAPI: MongoAPI = require("./mongo");
const socketAPI: SocketAPI = require("./webSocket");
const twitchBOT: TwitchBot = require("./twitchBot");

const gameManager: GameManager = (module.exports = {
    pendingShots: new Map<string, PendingShot>(),
    pendingAutoCancelRoundEvents: new Map<string, NodeJS.Timeout>(),
    delayedGames: [],
    addListeners() {
        const {
            joinListener,
            leaveListener,
            acknowledgeShotListener,
            chatShotListener,
        } = require("../listeners/game");
        socketAPI.addListener(joinListener);
        socketAPI.addListener(leaveListener);
        socketAPI.addListener(acknowledgeShotListener);
        twitchBOT.addListener(chatShotListener);
    },
    getSettings(user: string): Promise<SettingsInfoResponse> {
        return new Promise((resolve) => {
            if (mongoAPI.db == null) throw new Error("No database Connection");

            let newSettings = false;
            let settingsCollection: Collection = mongoAPI.db.collection(
                process.env.SETTINGS_COLLECTION_NAME || "settings"
            );

            settingsCollection
                .findOne({ channel: user })
                .then((settings: any) => {
                    //create new settings if none and mark new user
                    if (!settings) {
                        console.log("Creating new settings for " + user);
                        settings = new GameSetting(user);
                        settingsCollection.insertOne(settings);
                        newSettings = true;
                    }
                    resolve({
                        settings: settings,
                        newData: newSettings,
                    });
                });
        });
    },
    getAggregatedData(channel: string): Promise<AggregatedResponse> {
        return new Promise((resolve) => {
            if (mongoAPI.db == null) throw new Error("No database Connection");
            let settingsCollection: Collection = mongoAPI.db.collection(
                process.env.SETTINGS_COLLECTION_NAME || "settings"
            );
            settingsCollection
                .aggregate([
                    {
                        $lookup: {
                            from:
                                process.env.ROUND_COLLECTION_NAME ||
                                "roundInfo",
                            localField: "channel",
                            foreignField: "channel",
                            as: "roundInfo",
                            pipeline: [
                                {
                                    $match: { isComplete: false },
                                },
                            ],
                        },
                    },
                    { $match: { channel: channel } },
                    { $limit: 1 },
                ])
                .toArray()
                .then((data) => {
                    let roundInfo: RoundInfo;
                    let settings: GameSetting;
                    let newUser: boolean = false;
                    if (data.length != 0) {
                        settings = data[0] as any as GameSetting;
                    } else {
                        console.log("creating new settings for " + channel);
                        settings = new GameSetting(channel);
                        mongoAPI.db &&
                            mongoAPI.db
                                .collection(
                                    process.env.SETTINGS_COLLECTION_NAME ||
                                        "settings"
                                )
                                .insertOne(settings); //why is ts making me check for db again?
                        newUser = true;
                    }
                    if (data[0] && data[0].roundInfo.length != 0) {
                        roundInfo = data[0].roundInfo[0];
                    } else {
                        console.log("Creating new round for " + channel);
                        roundInfo = new RoundInfo(channel, settings.hoopsSpawn);
                        mongoAPI.db &&
                            mongoAPI.db
                                .collection(
                                    process.env.ROUND_COLLECTION_NAME ||
                                        "roundinfo"
                                )
                                .insertOne(roundInfo);
                    }

                    resolve({
                        settings: settings,
                        roundInfo: roundInfo,
                        newData: newUser,
                    });
                });
        });
    },
    logResult(channel: string, shot: ShotResult): Promise<LoggedShotResponse> {
        return new Promise<LoggedShotResponse>((resolve) => {
            if (!shot) throw new Error("Missing shot info");
            gameManager
                .getAggregatedData(channel)
                .then(({ settings, roundInfo }) => {
                    //DELAY GAME IN TWITCH CHAT DURING STREAM DELAY
                    gameManager.delayedGames.push(channel);
                    setTimeout(() => {
                        twitchBOT.say(
                            getResponseMessage(settings.chat, roundInfo, shot),
                            channel
                        );
                        const index = gameManager.delayedGames.indexOf(channel);
                        if (index > -1)
                            gameManager.delayedGames =
                                gameManager.delayedGames.splice(index, 1);
                    }, settings.chat.delay);

                    //cancel auto cancel event
                    let timeOut = gameManager.pendingAutoCancelRoundEvents.get(channel);
                    if (timeOut) {
                        clearTimeout(timeOut);
                    }
                    gameManager.pendingAutoCancelRoundEvents.delete(channel);

                    if (shot.result == "SUCCESS") {
                        const newRound = new RoundInfo(
                            channel,
                            settings.hoopsSpawn
                        );
                        mongoAPI.db &&
                            mongoAPI.db
                                .collection(
                                    process.env.ROUND_COLLECTION_NAME ||
                                        "roundinfo"
                                )
                                .updateOne(
                                    { channel: channel, isComplete: false },
                                    {
                                        $push: { shots: shot },
                                        $set: {
                                            isComplete: true,
                                            inProgress: false,
                                        },
                                    }
                                )
                                .then(() => {
                                    mongoAPI.db &&
                                        mongoAPI.db
                                            .collection(
                                                process.env
                                                    .ROUND_COLLECTION_NAME ||
                                                    "roundinfo"
                                            )
                                            .insertOne(newRound)
                                            .then((result) => {
                                                resolve({
                                                    hoopPosition:
                                                        newRound.hoopLocation,
                                                    attempts: 0,
                                                    roundID: result.insertedId,
                                                });
                                            });
                                });
                    } else {
                        mongoAPI.db &&
                            mongoAPI.db
                                .collection(
                                    process.env.ROUND_COLLECTION_NAME ||
                                        "roundinfo"
                                )
                                .updateOne(
                                    { channel: channel, isComplete: false },
                                    {
                                        $push: { shots: shot },
                                        $set: { inProgress: false },
                                    }
                                );

                        resolve({
                            hoopPosition: roundInfo.hoopLocation,
                            attempts: roundInfo.shots.length + 1,
                            roundID: roundInfo._id
                                ? roundInfo._id
                                : "missingID",
                        });
                    }
                });
        });
    },
    setAutoResetTimer(channel: string, roundID: ObjectId) {
        let timeout: NodeJS.Timeout = setTimeout(() => {
            console.log(
                `auto cancelling shot for ${channel}, roundID: ${roundID}`
            );
            mongoAPI.db &&
                mongoAPI.db
                    .collection(
                        process.env.ROUND_COLLECTION_NAME || "roundinfo"
                    )
                    .updateOne(
                        { _id: roundID },
                        { $set: { inProgress: false } }
                    );
            //Can I have an object delete from within itself?????
            gameManager.pendingAutoCancelRoundEvents.delete(channel);
        }, 15000);
        timeout && gameManager.pendingAutoCancelRoundEvents.set(channel, timeout);
    },
    setShotAcknowledgment(channel: string, roundID: ObjectId) {
        gameManager.pendingShots.delete(channel);
        gameManager.setAutoResetTimer(channel, roundID);
    },
});
