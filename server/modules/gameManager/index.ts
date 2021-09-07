import { SocketListener, SocketAPI } from '../webSocket';
import { Game } from './models/game';
import { ShotResult, ShotInfo } from './utils';
import { TwitchBot, ChatListener } from '../twitchBot';

const HELP_MSG: string = "Please enter !shot followed by x, y, z [1-100].";

const getShot = (user: string, commands: string[]): ShotInfo | false => {
    if (commands.length < 4) return false;
    else {
        let x = parseFloat(commands[1]);
        let y = parseFloat(commands[2]);
        let z = parseFloat(commands[3]);
        if (x === NaN || y == NaN || z == NaN) return false;
        return {
            user: user,
            shot: { x, y, z }
        }
    }
}

export interface GameManager {
    games: Map<string, Game>,
    init: () => void,
    addGame: (channel: string) => Promise<Game>,
    findGame: (channel: string) => Game | undefined,
    logResult: (channel: string, result: ShotResult) => void,
}

const gameManager: GameManager = module.exports = {
    games: new Map<string, Game>(),
    init: () => {
        //tell socketAPI to listen for people joining channels
        const socketAPI: SocketAPI = require('../webSocket');
        const twitchBOT: TwitchBot = require('../twitchBot');

        //add socket listeners
        const joinListener: SocketListener = {
            event: "JOIN_CHANNEL",
            callable: (socket, channel: string) => socket.join(`twoops-${channel}`)
        };
        const leaveListener: SocketListener = {
            event: "LEAVE_CHANNEL",
            callable: (socket, channel: string) => {
                socket.leave(channel);
                gameManager.games.delete(channel);
            }
        };
        socketAPI.addListener(joinListener);
        socketAPI.addListener(leaveListener);

        //add chatbot listeners
        const chatListener: ChatListener = {
            command: "!shot",
            callback: (channel: string, tags: any, commands: string[]) => {
                const user: string | null = tags["display-name"] ? tags["display-name"] : null;
                channel = channel.slice(1);

                if (!user) throw new Error("Error. Lost username?");
                if (gameManager.games.get(channel) == undefined) throw new Error(`Error Registering Shot. Could not find game for ${channel}`);

                let shot: ShotInfo | boolean = getShot(user, commands);

                if (!shot) return HELP_MSG;
                else {
                    let game = gameManager.games.get(channel);
                    if (game == undefined) throw new Error(`Error Registering Shot. Could not find game for ${channel}`);
                    return game.registerShot(shot);
                }
            }
        };
        twitchBOT.addListener(chatListener);
    },
    addGame: (channel: string) => {
        return new Promise<Game>((resolve) => {
            let game: Game | undefined = gameManager.games.get(channel);
            if (game) resolve(game);
            else {
                game = new Game(channel, (game: Game) => {
                    gameManager.games.set(channel, game);
                    resolve(game);
                });
            }
        })
    },
    findGame: (channel: string) => gameManager.games.get(channel),
    logResult: (channel: string, result: ShotResult) => {
        let game: Game | undefined = gameManager.games.get(channel);
        if (!game) throw new Error("Attempting to log result for game that does not exist.");
        game.logResult(result);
    },
}