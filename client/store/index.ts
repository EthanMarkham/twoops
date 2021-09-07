import { Triplet } from '@react-three/cannon';
import create from 'zustand';
import { getRandomPosition, Boundries } from '../utils/getRandomHoopPosition';
import socketIO, { Socket } from 'socket.io-client';
import { v4 } from 'uuid';

interface RoundInfo {
    id: string,
    attempts: number,
    shot: {
        user: string | null,
        throwValues: Triplet,
        isThrown: boolean,
    },
    results: {
        isAirball: boolean,
        success: boolean,
        showing: boolean,
    },
    roundOverTrigger: boolean
}
interface SettingsInfo {
    channel: string,
    hoopSpawn: Boundries,
    resetTime: number,
    ballSpawn: Triplet,
    alphaChannel: string
}

interface ResultMessage {
    success: boolean,
    isAirball: boolean,
}

export interface Store {
    pageIndex: Page,
    socket: Socket,
    settings: SettingsInfo,
    roundInfo: RoundInfo,
    error: null | Error,
    set: (data: {
        channel?: string,
        hoopsSpawn?: Boundries,
        resetTime?: number,
        ballSpawn?: Triplet,
        alphaChannel?: string
    }) => void,
    setPage: (page: Page) => void,
    setError: (error: Error) => void,
    setShot: (user: string, value: Triplet) => void,
    setResults: (data: ResultMessage) => void,
    triggerNewRound: () => void,
    newRound: () => void,
}

export enum Page {
    LOADING = "LOADING",
    SETTINGS = "SETTINGS",
    GAME = "GAME",
    ERROR = "ERROR",
}

const DEFAULTS: {
    SETTINGS: SettingsInfo,
    ROUND: RoundInfo
} = {
    SETTINGS: {
        channel: "",
        hoopSpawn: {
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
        resetTime: 5000,
        ballSpawn: [-18, 5, 0],
        alphaChannel: "#ffffff"
    },
    ROUND: {
        id: v4(),
        attempts: 0,
        shot: {
            isThrown: false,
            user: null,
            throwValues: [0, 0, 0]
        },
        results: {
            showing: false,
            isAirball: true,
            success: false,
        },
        roundOverTrigger: false,
    },
}

const useStore = create<Store>((set, get) => ({
    pageIndex: Page.LOADING,
    socket: socketIO("/", { autoConnect: true, reconnectionDelayMax: 10000 }),
    roundInfo: DEFAULTS.ROUND,
    settings: DEFAULTS.SETTINGS,
    error: null,
    setShot: (user, value) => set(state => ({
        ...state,
        roundInfo: {
            ...state.roundInfo,
            shot: {
                user: user,
                throwValues: value,
                isThrown: false,
            }
        }
    })),
    set: data => set(state => ({
        ...state,
        settings: {
            ...state.settings,
            ...data
        },
    })),
    setPage: page => set(state => ({ ...state, pageIndex: page })),
    setError: err => set(state => ({
        ...state,
        pageIndex: Page.ERROR,
        error: err
    })),
    setResults: ({ success, isAirball }) => set(state => ({
        ...state,
        roundInfo: {
            ...state.roundInfo,
            results: {
                showing: true,
                isAirball: isAirball,
                success: success,
            }

        }
    })),
    triggerNewRound: () => set(state => ({
        ...state,
        roundInfo: {
            ...state.roundInfo,
            roundOverTrigger: true,
        }
    })),
    newRound: () => {
        let copy: Store = get();
        let body = {
            user: copy.roundInfo.shot.user,
            throw: {
                x: copy.roundInfo.shot.throwValues[0],
                y: copy.roundInfo.shot.throwValues[1],
                z: copy.roundInfo.shot.throwValues[2]
            },
            result: copy.roundInfo.results.success ? "SUCCESS" : copy.roundInfo.results.isAirball ? "AIRBALL" : "BRICK"
        };
        console.log('posting', body)
        fetch('/api/postShot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    set(state => ({
                        ...state,
                        roundInfo: {
                            ...DEFAULTS.ROUND,
                            id: v4(),
                            attempts: state.roundInfo.results.success ? 0 : state.roundInfo.attempts + 1
                        }
                    }))
                }
            })
    }
}))

export default useStore;
