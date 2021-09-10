import GameSetting from "../mongoApi/models/gameSettings";
import RoundInfo from "../mongoApi/models/roundInfo";

//ENUMS
export enum ResultStatus{
    AIRBALL,
    BRICK,
    SUCCESS
}

//INTERFACE
export interface Triplet{
    x: number,
    y: number,
    z: number
}

export interface RoundResponse {
    round: RoundInfo,
    new: boolean
}
export interface SettingsResponse {
    settings: GameSetting,
    new: boolean
}

export interface ShotInfo{
    user: string,
    shot: {
        x: number,
        y: number,
        z: number
    }
}

export interface ShotResult{
    user: string,
    throw: {
        x: number,
        y: number,
        z: number
    },
    result: ResultStatus
}

export interface RoundResponse {
    round: RoundInfo,
    new: boolean
}

export interface SettingsResponse {
    settings: GameSetting,
    new: boolean
}

export interface AggregatedResponse {
    settings: GameSetting,
    roundInfo: RoundInfo
}

export interface GameManager{
    addListeners: () => void,
    getRound: (user: string) => Promise<RoundResponse>,
    getSettings: (user: string) => Promise<SettingsResponse>,
    getAggregatedData: (user: string) => Promise<AggregatedResponse> 
    logResult: (channel: string, shot: ShotResult) => void
}


