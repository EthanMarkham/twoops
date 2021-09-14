import { ChatListener } from "../modules/twitchBot";
import { SocketListener } from "../modules/webSocket";
import { AggregatedResponse, PendingShot, ShotInfo } from "../types/game";
import { getShot } from "../utils";

const HELP_MSG: string = "Please enter !shot followed by x, y, z [1-100].";

export const joinListener: SocketListener = {
    event: "JOIN_CHANNEL",
    callable: (socket, channel: string) => socket.join(`twoops-${channel}`),
};

export const leaveListener: SocketListener = {
    event: "LEAVE_CHANNEL",
    callable: (socket, channel: string) => {
        socket.leave(channel);
        require("../modules/twitchBot").leaveChannel(channel);
    },
};

export const acknowledgeShotListener: SocketListener = {
    event: "ACKNOWLEDGED_SHOT",
    callable: (_, channel: string) => {
        const mongoAPI = require("../modules/mongo");
        const gameManager = require("../modules/game");

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

        if (mongoAPI.db == null) throw new Error("No database Connection");
        mongoAPI.db
            .collection(process.env.ROUND_COLLECTION_NAME || "roundinfo")
            .updateOne(
                { _id: pendingShot.roundID },
                { $set: { inProgress: true } }
            );

        gameManager.pendingShots.delete(channel);
        //setTimeout(() => gameManager.setInProgress(channel, false), 60000)
    },
};

export const chatShotListener: ChatListener = {
    command: "!shot",
    callback: (channel: string, tags: any, commands: string[]) => {
        const gameManager = require("../modules/game");
        const socketAPI = require("../modules/webSocket");
        const twitchAPI = require("../modules/twitchBot");

        const user: string | null = tags["display-name"]
            ? tags["display-name"]
            : null;

        channel = channel.slice(1);

        if (!user) throw new Error("Error. Lost username?");

        gameManager
            .getAggregatedData(channel)
            .then(({ settings, roundInfo }: AggregatedResponse) => {
                let shot: ShotInfo | boolean = getShot(user, commands);

                if (!shot) twitchAPI.say(HELP_MSG, user);
                else {
                    if (
                        settings.chat.responseEnabled &&
                        roundInfo.inProgress &&
                        !gameManager.delayedGames.includes(channel)
                    )
                        twitchAPI.say(
                            settings.chat.inProgressMessage.replace(
                                "@user",
                                `@${user}`
                            ),
                            channel
                        );
                    else {
                        //EMIT SOCKET INFO
                        if (!socketAPI.io)
                            throw new Error("No socket connection.");
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
