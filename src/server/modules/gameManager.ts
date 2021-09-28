import { SocketListener } from "./webSocket";
import { ChatListener } from "./twitchBot";
import { ObjectId } from "mongodb";
import {
    ShotResult,
    PendingShot,
    GameManager,
    LoggedShotResponse,
    ShotInfo,
    UserDataResponse,
} from "../types/game";
import { getResponseMessage, getShot } from "../utils";
import { GameDAO } from "../types/mongo";

const socketAPI = require("../modules/webSocket");
const twitchAPI = require("../modules/twitchBot");
const gameDAO: GameDAO = require("../dao/gameDAO");

const HELP_MSG: string = "Please enter !shot followed by x, y, z [1-100].";

//Commands
export const joinSocketChannelListener: SocketListener = {
    event: "JOIN_CHANNEL",
    callable: (socket, channel: string) => socket.join(`twoops-${channel}`),
};

export const leaveSocketChannelListener: SocketListener = {
    event: "LEAVE_CHANNEL",
    callable: (socket, channel: string) => {
        socket.leave(channel);
        require("../modules/twitchBot").leaveChannel(channel);
    },
};

export const acknowledgeShotListener: SocketListener = {
    event: "ACKNOWLEDGED_SHOT",
    callable: (_, channel: string) => {
        let pendingShot: PendingShot | undefined =
            gameManager.pendingShots.get(channel);

        if (!pendingShot)
            throw new Error(
                "Registering shot for channel that does not exist."
            );
        if (!pendingShot.roundID)
            throw new Error("Registering shot for round that does not exist.");

        if (pendingShot.chat)
            require("../modules/twitchBot").say(pendingShot.chat, channel);

        gameDAO.setInProgress(pendingShot.roundID, true);
        gameManager.setShotAcknowledgment(channel, pendingShot.roundID);
    },
};

export const chatShotListener: ChatListener = {
    command: "!shot",
    callback: (channel: string, tags: any, commands: string[]) => {
        const user: string | null = tags["display-name"]
            ? tags["display-name"]
            : null;

        channel = channel.slice(1);

        if (!user) throw new Error("Error. Lost username?");
        if (!socketAPI.io) throw new Error("No socket connection.");
        gameDAO
            .getUserData(channel)
            .then(({ settings, roundInfo }: UserDataResponse) => {
                let shot: ShotInfo | boolean = getShot(user, commands);

                if (!shot) twitchAPI.say(HELP_MSG, channel);
                else {
                    if (
                        roundInfo.inProgress &&
                        gameManager.delayedGames.get(channel) != undefined &&
                        gameManager.pendingShots.get(channel) != undefined
                    ) {
                        console.log(
                            "caught shot attempt for round in progress"
                        );
                        if (settings.chat.responseEnabled)
                            twitchAPI.say(
                                settings.chat.inProgressMessage.replace(
                                    "@user",
                                    `@${user}`
                                ),
                                channel
                            );
                    } else {
                        socketAPI.io
                            .to(`twoops-${channel}`)
                            .emit("NEW_SHOT", shot);

                        //add to pending shots
                        let pendingShot: PendingShot = {
                            shot: shot,
                            channel: channel,
                            roundID: roundInfo._id,
                        };

                        if (settings.chat.responseEnabled)
                            pendingShot.chat =
                                settings.chat.shotAcknowledged.replace(
                                    "@user",
                                    `@${user}`
                                );
                        gameManager.pendingShots.set(channel, pendingShot);
                    }
                }
            });
    },
};

const gameManager: GameManager = (module.exports = {
    pendingShots: new Map<string, PendingShot>(),
    pendingAutoCancelRoundEvents: new Map<string, NodeJS.Timeout>(),
    delayedGames: new Map<string, boolean>(),
    addListeners() {
        socketAPI.addListener(joinSocketChannelListener);
        socketAPI.addListener(leaveSocketChannelListener);
        socketAPI.addListener(acknowledgeShotListener);
        twitchAPI.addListener(chatShotListener);
    },
    initChatDelay(channel: string, chat: string, delay: number) {
        gameManager.delayedGames.set(channel, true);
        setTimeout(() => {
            twitchAPI.say(chat, channel);
            gameManager.delayedGames.delete(channel);
        }, delay);
    },
    cancelAutoCancel(channel: string) {
        let timeOut = gameManager.pendingAutoCancelRoundEvents.get(channel);
        if (timeOut) clearTimeout(timeOut);
        gameManager.pendingAutoCancelRoundEvents.delete(channel);
    },
    logResult(channel: string, shot: ShotResult): Promise<LoggedShotResponse> {
        return new Promise<LoggedShotResponse>((resolve) => {
            if (!shot) throw new Error("Missing shot info");
            gameDAO.getUserData(channel).then(({ settings, roundInfo }) => {
                let msg = getResponseMessage(settings.chat, roundInfo, shot);
                gameManager.initChatDelay(channel, msg, settings.chat.delay);
                gameManager.cancelAutoCancel(channel);

                gameDAO.addShot(channel, shot);

                if (shot.result == "SUCCESS") {
                    gameDAO
                        .createRound(channel, settings.hoopsSpawn)
                        .then((newRound) => {
                            resolve({
                                hoopPosition: newRound.hoopLocation,
                                attempts: 0,
                                roundID: newRound._id || "1",
                            });
                        });
                } else {
                    resolve({
                        hoopPosition: roundInfo.hoopLocation,
                        attempts: roundInfo.shots.length + 1,
                        roundID: roundInfo._id ? roundInfo._id : "missingID",
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
            gameDAO.setInProgress(roundID, false);
            //Can I have an object delete from within itself?????
            gameManager.pendingAutoCancelRoundEvents.delete(channel);
        }, 15000);
        gameManager.pendingAutoCancelRoundEvents.set(channel, timeout);
    },
    setShotAcknowledgment(channel: string, roundID: ObjectId) {
        gameManager.pendingShots.delete(channel);
        gameManager.setAutoResetTimer(channel, roundID);
    },
});
