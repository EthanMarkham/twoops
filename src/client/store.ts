import create from "zustand";
import socketIO, { Socket } from "socket.io-client";
import { v4 } from "uuid";
import { Triplet } from "@react-three/cannon";

export enum Page {
    LOADING = "LOADING",
    SETTINGS = "SETTINGS",
    GAME = "GAME",
    ERROR = "ERROR",
}

interface NewRoundInfo {
    hoopPosition: Triplet;
    id: string;
    attempts: number;
}

interface RoundInfo extends NewRoundInfo {
    shot: {
        user: string | null;
        throwValues: Triplet;
    };
    results: {
        isAirball: boolean;
        success: boolean;
        showing: boolean;
    };
}

export interface ChatInfo {
    responsesEnabled: boolean;
    delay: number;
    shotAcknowledged: string;
    inProgressMessage: string;
    firstTryMessage: string;
    airballResponse: string;
    reboundResponse: string;
    brickResponse: string;
    bucketResponse: string;
}

export interface ColorInfo {
    background: string;
    backboard: string;
}

export interface SettingsInfo {
    showingPanel: boolean;
    channel: string;
    ballSpawn: Triplet;
    chat: ChatInfo;
    colors: ColorInfo;
}

interface ResultMessage {
    success: boolean;
    isAirball: boolean;
}

export interface Store {
    pageIndex: Page;
    socket: Socket;
    settings: SettingsInfo;
    roundInfo: RoundInfo;
    lastShot: Date;
    error: null | Error;
    getGameData(): void;
    toggleSettings: () => void;
    updateSettings(info: SettingsInfo): void;
    setShot(user: string, value: Triplet): void;
    setResults(
        data: ResultMessage,
        callback: (data: NewRoundInfo) => void
    ): void;
    newRound(data: NewRoundInfo): void;
}

const DEFAULTS: {
    SETTINGS: SettingsInfo;
    ROUND: RoundInfo;
} = {
    SETTINGS: {
        showingPanel: false,
        channel: "",
        ballSpawn: [-18, 5, 0],
        chat: {
            delay: 0,
            responsesEnabled: false,
            shotAcknowledged: "",
            inProgressMessage: "",
            firstTryMessage: "",
            airballResponse: "",
            reboundResponse: "",
            brickResponse: "",
            bucketResponse: "",
        },
        colors: {
            background: "",
            backboard: "",
        },
    },
    ROUND: {
        id: v4(),
        attempts: 0,
        shot: {
            user: null,
            throwValues: [0, 0, 0],
        },
        hoopPosition: [0, 0, -500],
        results: {
            showing: false,
            isAirball: true,
            success: false,
        },
    },
};

const useStore = create<Store>((set, get) => ({
    pageIndex: Page.LOADING,
    socket: socketIO("/", { autoConnect: true, reconnectionDelayMax: 10000 }),
    roundInfo: DEFAULTS.ROUND,
    settings: DEFAULTS.SETTINGS,
    lastShot: new Date(),
    error: null,
    setShot(user, value) {
        set((state) => ({
            ...state,
            lastShot: new Date(),
            roundInfo: {
                ...state.roundInfo,
                shot: {
                    user: user,
                    throwValues: value,
                },
            },
        }));
    },
    toggleSettings() {
        set((state) => ({
            ...state,
            settings: {
                ...state.settings,
                showingPanel: !state.settings.showingPanel,
            },
        }));
    },
    getGameData() {
        fetch("/api/init")
            .then((data: any) => data.json())
            .then((data: any) => {
                console.log(data);
                if (data.error) {
                } else {
                    if (data.newSettings) {
                        //start tutorial
                        console.log("caught new attempt show tutorial");
                    }
                    set((state) => ({
                        ...state,
                        pageIndex: Page.GAME,
                        settings: {
                            ...state.settings,
                            ...data.settings,
                            showingPanel: data.newSettings,
                            channel: data.channel,
                            ballSpawn: data.ballsSpawn,
                        },
                        roundInfo: {
                            ...state.roundInfo,
                            id: data.roundID,
                            attempts: data.attempts,
                            hoopPosition: data.hoopPosition,
                        },
                    }));
                }
            });
    },
    updateSettings(data) {
        set((state) => ({
            ...state,
            settings: {
                ...data,
            },
        }));
        //remove extra data
        let dataCopy = data as any;
        delete dataCopy.showingPanel;

        fetch("/api/updateSettings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataCopy),
        });
    },
    setResults({ success, isAirball }, callback) {
        set((state) => ({
            ...state,
            roundInfo: {
                ...state.roundInfo,
                results: {
                    showing: true,
                    isAirball: isAirball,
                    success: success,
                },
            },
        }));
        const copy: Store = get();
        fetch("/api/logShot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: copy.roundInfo.shot.user,
                throw: copy.roundInfo.shot.throwValues,
                result: success ? "SUCCESS" : isAirball ? "AIRBALL" : "BRICK",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("logged response", data);
                callback(data);
            });
    },
    newRound(data) {
        set((state) => ({
            ...state,
            roundInfo: {
                ...DEFAULTS.ROUND,
                ...data,
            },
        }));
    },
}));

export default useStore;
