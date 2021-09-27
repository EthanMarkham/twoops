import { Triplet } from "@react-three/cannon";
import { ObjectId } from "mongodb";
import GameSetting from "../models/gameSettings";
import RoundInfo from "../models/roundInfo";

//API RESPONSES
export interface DataRequest {
    newData: boolean;
}
export interface RoundInfoResponse extends DataRequest {
    round: RoundInfo;
}
export interface SettingsInfoResponse extends DataRequest {
    settings: GameSetting;
}
export interface LoggedShotResponse {
    hoopPosition: Triplet;
    attempts: number;
    roundID: ObjectId | string;
}
export interface AggregatedResponse extends DataRequest {
    newData: boolean;
    settings: GameSetting;
    roundInfo: RoundInfo;
}

//GAME DATA
export interface JSONTriplet {
    x: number;
    y: number;
    z: number;
}
export interface ShotInfo {
    user: string;
    shot: JSONTriplet;
}
export interface ShotResult extends ShotInfo {
    result: string;
}
export interface PendingShot {
    shot: ShotInfo;
    channel: string;
    roundID: ObjectId | undefined;
    chat?: string;
}
export interface Limits {
    MIN: number;
    MAX: number;
}

export interface Boundaries {
    x: Limits;
    y: Limits;
    z: Limits;
}

export interface ChatSettings {
    responseEnabled: boolean;
    delay: number;
    shotAcknowledged: string;
    bucketResponse: string;
    brickResponse: string;
    airballResponse: string;
    inProgressMessage: string;
    firstTryMessage: string;
}

    
export interface ChatSettings {
    responseEnabled: boolean;
    delay: number;
    shotAcknowledged: string;
    bucketResponse: string;
    brickResponse: string;
    airballResponse: string;
    inProgressMessage: string;
    firstTryMessage: string;
}

export interface ColorSettings {
    background: string;
    backboard: string;
    
}

//MODULES
export interface GameManager {
    setAutoResetTimer(channel: string, roundID: ObjectId): void;
    pendingAutoCancelRoundEvents: Map<string, NodeJS.Timeout>;
    pendingShots: Map<string, PendingShot>;
    delayedGames: Map<string, boolean>;
    addListeners: () => void;
    getSettings: (user: string) => Promise<SettingsInfoResponse>;
    getAggregatedData: (user: string) => Promise<AggregatedResponse>;
    logResult: (
        channel: string,
        shot: ShotResult
    ) => Promise<LoggedShotResponse>;
}
