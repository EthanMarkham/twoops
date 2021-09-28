import {
    Collection,
    MongoClient,
    Db,
    InsertOneResult,
    UpdateResult,
    ObjectId,
} from "mongodb";
import GameSetting from "../models/gameSettings";
import RoundInfo from "../models/roundInfo";
import {
    UserDataResponse,
    SettingsInfoResponse,
    ShotInfo,
    ShotResult,
    Boundaries,
} from "./game";

export interface MongoAPI {
    collections: Map<string, Collection>;
    client: MongoClient;
    db: Db | null;
    dao: DAO[];
    init(callback?: () => void): void;
    addDAO(dao: DAO): void;
}

export interface ENV {
    DB_CONN_STRING: string;
    DB_NAME: string;
    SETTINGS_COLLECTION_NAME: string;
    ROUND_COLLECTION_NAME: string;
}

export interface DAO {
    verifyDBConnection(): void;
    collections: {
        settings: Collection | null;
        roundInfo: Collection | null;
    };
    setCollections(): void;
}

export interface GameDAO extends DAO {
    getSettings(channel: string): Promise<SettingsInfoResponse>;
    createSettings(channel: string): GameSetting;
    getUserData(channel: string): Promise<UserDataResponse>;
    addShot(channel: string, shot: ShotResult): Promise<UpdateResult>;
    createRound(channel: string, hoopsSpawn: Boundaries): Promise<RoundInfo>;
    createSettings(channel: string): GameSetting;
    setInProgress(roundID: ObjectId, value: boolean): void;
}
