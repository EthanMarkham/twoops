import { ObjectId } from "mongodb";
import { Triplet } from '@react-three/cannon';

//can I share interface between client and server?
export interface Limits{
    MIN: number, 
    MAX: number
}

export interface Boundaries {
    x: Limits,
    y: Limits,
    z: Limits
}

export interface ChatSettings {
    responseEnabled: boolean,
    delay: number,
    shotAcknowledged: string,
    bucketResponse: string,
    brickResponse: string,
    airballResponse: string,
    inProgressMessage: string,
    firstTryMessage: string,
}

export default class GameSetting {
    constructor(
        public channel: string,
        public hoopsSpawn: Boundaries =  {
            x: {
                MIN: -15,
                MAX: 30
            },
            y: {
                MIN: 28,
                MAX: 30
            },
            z: {
                MIN: 5,
                MAX: 10
            },
        },
        public ballSpawn: Triplet = [-18, 5, 0],
        public alphaChannel: string = "#808080",
        public chat: ChatSettings = {
            responseEnabled: true,
            delay: 10000,
            shotAcknowledged: "@user is shooting!",
            inProgressMessage: "@user ⏰ 🕐 ⏲ 🕝",       
            bucketResponse: "justKobe  Nice Shot! Getbuckets @user Got a Bucket! ShaqSpicy ShaqSpicy",       
            brickResponse: "CLONK!  @user bricked it",       
            airballResponse: "Ooof! @user shot an AIRBALL!",
            firstTryMessage: " ON THE FIRST TRY!! ShaqSpicy ShaqSpicy justKobe justKobe pikachuS",
        },
        public _id?: ObjectId
    ) { }

}