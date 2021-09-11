import { Triplet } from '@react-three/cannon';
import create from 'zustand';
import socketIO, { Socket } from 'socket.io-client';
import { v4 } from 'uuid';

interface RoundInfo {
    id: string,
    attempts: number,
    hoopLocation: Triplet,
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
    getGameData: () => void,
    setShot: (user: string, value: Triplet) => void,
    setResults: (data: ResultMessage) => void,
    triggerNewRound: () => void,
    logResult: () => void,
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
        hoopLocation: [0, 0, -500],
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
    getGameData: () => {
        fetch('/api/init')
            .then((data: any) => data.json())
            .then((data: any) => {
                console.log(data);
                if (data.error) {
                }
                else {
                    if (data.newSettings) {
                        //start tutorial
                        console.log("caught new attempt show tutorial")
                    }
                    set(state => ({
                        ...state,
                        pageIndex: Page.GAME,
                        settings: {
                            ...state.settings,
                            ...data
                        },
                        roundInfo: {
                            ...state.roundInfo,
                            id: data.roundID,
                            attempts: data.attempts,
                            hoopLocation: data.hoopLocation
                        }
                    }))
                }
            });
    },
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
    logResult: () => {
        let copy: Store = get();
        fetch('/api/logShot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: copy.roundInfo.shot.user,
                throw: copy.roundInfo.shot.throwValues,
                result: copy.roundInfo.results.success ? "SUCCESS" : copy.roundInfo.results.isAirball ? "AIRBALL" : "BRICK",
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('logged response', data)
                set(state => ({
                    ...state,
                    roundInfo: {
                        ...DEFAULTS.ROUND,
                        hoopLocation: data.hoopPosition,
                        id: data.roundID,
                        attempts: data.attempts,
                    }
                }))
            })
    }
}))

export default useStore;
