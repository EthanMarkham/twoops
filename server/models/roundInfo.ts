import { ObjectId } from "mongodb";
import { Triplet } from '@react-three/cannon';
import { Boundries, ShotResult } from "../types/game";
import { getRandomPosition } from '../utils';

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