export interface Triplet{
    x: number,
    y: number,
    z: number
}
export const shotConverter = (shot: Triplet, shotConversions: Triplet):{x: number, y: number, z: number} => ({
    x: shot.x / 100 * shotConversions.x,
    y: shot.y / 100 * shotConversions.y,
    z: shot.z / 100 * shotConversions.x
})

export enum Result{
    AIRBALL,
    BRICK,
    SUCCESS
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
    result: Result
}