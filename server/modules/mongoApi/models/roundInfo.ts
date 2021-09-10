import { ObjectId } from "mongodb";
import { Triplet } from '@react-three/cannon';
import { ShotResult } from "../../gameManager/types";

export default class RoundInfo {
    constructor(
        public channel: string,
        public shots: Array<ShotResult> = new Array<ShotResult>(),
        public isComplete: boolean = false,
        public inProgress: boolean = false,
        public _id?: ObjectId
    ) { }
}