import { settings } from "cluster";
import { ObjectId, UpdateResult } from "mongodb";
import GameSetting from "../models/gameSettings";
import RoundInfo from "../models/roundInfo";
import {
    ShotResult,
    UserDataResponse,
    SettingsInfoResponse,
    Boundaries,
} from "../types/game";
import { MongoAPI, GameDAO } from "../types/mongo";

const mongoAPI: MongoAPI = require("../modules/mongo");

const gameDAO: GameDAO = (module.exports = {
    collections: {
        roundInfo: null,
        settings: null,
    },
    verifyDBConnection() {
        if (mongoAPI.db == null) throw new Error("No database Connection");
        if (
            gameDAO.collections.roundInfo == null ||
            gameDAO.collections.settings == null
        )
            throw new Error("No Collection Set");
    },
    setCollections() {
        if (mongoAPI.db == null) throw new Error("No database Connection");

        gameDAO.collections = {
            roundInfo: mongoAPI.db.collection(
                process.env.ROUND_COLLECTION_NAME || "roundInfo"
            ),
            settings: mongoAPI.db.collection(
                process.env.SETTINGS_COLLECTION_NAME || "settings"
            ),
        };
    },
    createSettings(channel: string): GameSetting {
        if (!gameDAO.collections.settings)
            throw new Error("No Settings Collection Found.");
        let settings = new GameSetting(channel);
        gameDAO.collections.settings.insertOne(settings);
        return settings;
    },
    getSettings(channel: string): Promise<SettingsInfoResponse> {
        return new Promise((resolve) => {
            if (!gameDAO.collections.settings)
                throw new Error("No Settings Collection Found.");
            let newSettings = false;
            gameDAO.collections.settings
                .findOne({ channel: channel })
                .then((settings: any) => {
                    //create new settings if one not found?
                    if (!settings) {
                        settings = gameDAO.createSettings(channel);
                        newSettings = true;
                    }
                    resolve({
                        settings: settings,
                        newData: newSettings,
                    });
                });
        });
    },
    //trim this func
    getUserData(channel: string): Promise<UserDataResponse> {
        return new Promise((resolve) => {
            if (!gameDAO.collections.roundInfo)
                throw new Error("No RoundInfo Collection Found.");
            if (!gameDAO.collections.settings)
                throw new Error("No Settings Collection Found.");
            gameDAO.collections.settings
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
    createRound(channel: string, hoopsSpawn: Boundaries): Promise<RoundInfo> {
        return new Promise((resolve) => {
            if (!gameDAO.collections.roundInfo)
                throw new Error("No RoundInfo Collection Found.");
            let roundInfo = new RoundInfo(channel, hoopsSpawn);
            gameDAO.collections.roundInfo
                .insertOne(roundInfo)
                .then((result) => {
                    roundInfo._id = result.insertedId;
                    resolve(roundInfo);
                });
        });
    },
    addShot(channel: string, shot: ShotResult): Promise<UpdateResult> {
        if (!gameDAO.collections.roundInfo)
            throw new Error("No RoundInfo Collection Found.");
        return gameDAO.collections.roundInfo.updateOne(
            { channel: channel, isComplete: false },
            {
                $push: { shots: shot },
                $set: {
                    isComplete: shot.result == "SUCCESS",
                    inProgress: false,
                },
            }
        );
    },
    setInProgress(roundID: ObjectId, value: boolean): void {
        if (!gameDAO.collections.roundInfo)
            throw new Error("No RoundInfo Collection Found.");
        gameDAO.collections.roundInfo.updateOne(
            { _id: roundID },
            { $set: { inProgress: value } }
        );
    },
});

/*
    getRound(channel: string): Promise<any> {
        return new Promise((resolve) => {
            let collection: Collection = mongoAPI.db.collection(
                process.env.ROUND_COLLECTION_NAME || "roundInfo"
            );
            collection
                .find({ channel: channel, isComplete: false })
                .toArray()
                .then((data) => {
                    if (data.length === 0) throw new Error("No round found");
                    if (data.length > 1)
                        throw new Error("Multiple rounds found????");

                    resolve(data[0] as unknown as RoundInfo);
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
                    gameManager.delayedGames.set(channel, true);
                    setTimeout(() => {
                        twitchBOT.say(
                            getResponseMessage(settings.chat, roundInfo, shot),
                            channel
                        );
                        gameManager.delayedGames.delete(channel);
                    }, settings.chat.delay);

                    //cancel auto cancel event
                    let timeOut =
                        gameManager.pendingAutoCancelRoundEvents.get(channel);
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
                                    { channel, isComplete: false },
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
};
*/
