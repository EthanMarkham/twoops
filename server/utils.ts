import { Triplet } from "@react-three/cannon"
import RoundInfo from "./models/roundInfo"
import { Limits, Boundries, ChatSettings, ShotInfo, ShotResult } from "./types/game"

const shotConversions: Triplet = [15, 40, 3];

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

export const getShot = (user: string, commands: string[]): ShotInfo | false => {
    if (commands.length < 4) return false;
    else {
        let x = parseFloat(commands[1]);
        let y = parseFloat(commands[2]);
        let z = parseFloat(commands[3]);
        if (x === NaN || y == NaN || z == NaN) return false;
        if (0 > x || x > 100 || 0 > y || y > 100 || 0 > z || z > 100) return false;
        return {
            user: user,
            shot: shotConverter([x, y, z], shotConversions)
        }
    }
}
export const shotConverter = (shot: Triplet, shotConversions: Triplet): { x: number, y: number, z: number } => ({
    x: shot[0] / 100 * shotConversions[0],
    y: shot[1] / 100 * shotConversions[1],
    z: shot[2] / 100 * shotConversions[2]
})

export const getResponseMessage = (chat: ChatSettings, round: RoundInfo, result: ShotResult): string => {
    let msg = "";
    if (result.result == "SUCCESS") {
        msg = chat.bucketResponse;
        if (round.shots.length == 1) msg += chat.firstTryMessage;
    }
    else {
        msg = result.result == "AIRBALL" ? chat.airballResponse : chat.brickResponse;
        for (let i = 0; i < Math.random() * 5; i++) msg += '!';
    }
    return msg.replace('@user', `@${result.user}`);
}
