import { ObjectId } from "mongodb";
import { ShotResult } from "../modules/gameManager";
import { Triplet } from '@react-three/cannon';
import { Boundaries, Limits } from "./gameSettings";


const getRandomInt = (limits: Limits) => {
    return Math.floor(Math.random() * (limits.MAX - limits.MIN)) + limits.MIN
}

export const getRandomPosition = (boundaries: Boundaries): Triplet => {
    return [
        getRandomInt(boundaries.x),
        getRandomInt(boundaries.y),
        getRandomInt(boundaries.z)
    ]
}

export default class RoundInfo {
    hoopLocation: Triplet;
    constructor(
        public channel: string,
        boundaries: Boundaries,
        public shots: Array<ShotResult> = new Array<ShotResult>(),
        public isComplete: boolean = false,
        public inProgress: boolean = false,
        public _id?: ObjectId
    ) { 
        this.hoopLocation = getRandomPosition(boundaries);
    }
}