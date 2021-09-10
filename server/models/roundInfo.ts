import { ObjectId } from "mongodb";
import { ShotResult } from "../modules/gameManager";
import { Triplet } from '@react-three/cannon';
import { Boundries, Limits } from "./gameSettings";


const getRandomInt = (limits: Limits) => {
    return Math.floor(Math.random() * (limits.MAX - limits.MIN)) + limits.MIN
}

export const getRandomPosition = (boundries: Boundries): Triplet => {
    return [
        getRandomInt(boundries.x),
        getRandomInt(boundries.y),
        getRandomInt(boundries.z)
    ]
}

export default class RoundInfo {
    hoopLocation: Triplet;
    constructor(
        public channel: string,
        boundries: Boundries,
        public shots: Array<ShotResult> = new Array<ShotResult>(),
        public isComplete: boolean = false,
        public inProgress: boolean = false,
        public _id?: ObjectId
    ) { 
        this.hoopLocation = getRandomPosition(boundries);
    }
}