import { LocalStorageKeys } from "../enums/local-storage-keys";
import { sendApiRequest } from "../tools/send-api-request";
import { MapDTO } from "../types/dto/MapDTO";
import { SessionDTO } from "../types/dto/SessionDTO";
import { SessionService } from "../types/services/SessionService";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";

class SessionServiceImpl implements SessionService {
    private static _instance: SessionServiceImpl;
    sessionMap: MapDTO;

    private constructor() {}

    static getInstance() {
        if (!SessionServiceImpl._instance) {
            SessionServiceImpl._instance = new SessionServiceImpl();
        }
        return SessionServiceImpl._instance;
    }

    get sessionToken(): string {
        return LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.SESSION_TOKEN) || "";
    }

    async createSession(mapId: string): Promise<string> {
        return sendApiRequest("/sessions/create", "post", { mapId });
    }

    async connectToSession(token: string): Promise<SessionDTO> {
        LocalStorageServiceImpl.pushToStorage(LocalStorageKeys.SESSION_TOKEN, token);
        return sendApiRequest("/sessions/connect", "post", { token });
    }

    setSessionMap(map: MapDTO): void {
        this.sessionMap = map;
    }
}

/**
 * Return singleton service!
 */
export default function sessionServiceFactory(): SessionService {
    return SessionServiceImpl.getInstance();
}
