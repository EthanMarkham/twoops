import { Triplet } from '@react-three/cannon';

interface Limits{
    MIN: number, 
    MAX: number
}

export interface Boundries{
    x: Limits,
    y: Limits,
    z: Limits
}

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
