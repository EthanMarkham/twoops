import { Triplet, shotConverter, ShotInfo, ShotResult, Result } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { MongoAPI } from '../../mongoApi';
import GameSetting from '../../mongoApi/models/settings';
import { TwitchBot } from '../../twitchBot';

const shotConversions: Triplet = {
    x: 15,
    y: 40,
    z: 3,
}

export interface RoundInfo {
    id: string,
    shots: Array<ShotResult>,
    inProgress: boolean
}

const getNewRound = (): RoundInfo => ({
    id: uuidv4(),
    shots: new Array<ShotResult>(),
    inProgress: false,
})

export class Game {
    constructor(channel: string, callback?: (game: Game) => void) {
        require('dotenv').config();

        const collection: string = process.env.SETTINGS_COLLECTION_NAME ? process.env.SETTINGS_COLLECTION_NAME : "settings";
        const db: MongoAPI = require('../../mongoApi');

        this.settings = new GameSetting(channel); //temp settings while fetching from db

        db.getOne(collection, { channel: channel })
            .then((settings: GameSetting | null) => {
                if (!settings) {
                    settings = new GameSetting(channel);
                    db.addItem(collection, settings);
                    this.newSettings = true; //mark that settings were created for front end
               }
               this.settings = settings;
               if (callback) callback(this);   
            })
            .catch((err: Error) => { throw err; })

        this.channel = channel
        this.currentRound = getNewRound();
    }
    settings: GameSetting;
    channel: string;
    currentRound: RoundInfo;
    newSettings: boolean = false;
    registerShot({ user, shot }: ShotInfo): string {
        if (this.currentRound.inProgress) return this.settings.chat.inProgressMessage.replace('@user', `@${user}`);
        else {
            this.currentRound.inProgress = true;
            require('../../webSocket').io.to(`twoops-${this.channel}`).emit('NEW_SHOT', {
                shot: shotConverter(shot, shotConversions),
                user: user
            });
            return this.settings.chat.shotAcknowledged.replace('@user', `@${user}`);
        }
    }
    logResult(shot: ShotResult) {
        const twitchbot: TwitchBot = require('../../twitchBot');

        if (!this.currentRound.inProgress) return;

        this.currentRound.shots.push(shot);

        let msg = "";

        if (shot.result == Result.SUCCESS) {
            msg = `justKobe  Nice Shot! Getbuckets ${shot.user} Got a Bucket! ShaqSpicy ShaqSpicy`;
            let shoutCount = this.currentRound.shots.filter(s => s.user == shot.user).length;
            if (this.currentRound.shots.length == 1) msg += ` ON THE FIRST TRY!! ShaqSpicy ShaqSpicy justKobe justKobe pikachuS `
            else if (shoutCount < 4) msg += ` in ${shoutCount} attempts! 🏀 🏀 🏀`
            else msg += "!!! ShaqSpicy 🏀 🏀 🏀"
            this.currentRound = getNewRound();
        }

        else {
            //save current shot
            msg = shot.result == Result.AIRBALL ? `Ooof! ${shot.user} shot an AIRBALL!` : `CLONK! ${shot.user} bricked it`;
            let sameShotCount = this.currentRound.shots.filter(s => s.user == shot.user && s.result == shot.result).length - 1;
            if (sameShotCount >= 1) {
                msg += " AGAIN"
                for (let i = 1; i < sameShotCount; i++) {
                    msg += ` and AGAIN`
                }
            }
            msg += `!!!!`
            if (sameShotCount > 2) msg += " KApp"
        }

        setTimeout(() => {
            twitchbot.say(msg, this.channel);
            this.currentRound.inProgress = false;
        }, this.settings.chat.delay)
    }
}

