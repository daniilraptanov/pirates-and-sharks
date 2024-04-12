import { LocalStorageKeys } from "../enums/local-storage-keys";
import { sendApiRequest } from "../tools/send-api-request";
import { SessionService } from "../types/services/SessionService";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";

class SessionServiceImpl implements SessionService {
    get sessionToken(): string {
        return LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.SESSION_TOKEN) || "";
    }

    async createSession(): Promise<string> {
        // TODO :: User should be select a Map on start page
        return sendApiRequest("/sessions", "post", { mapId: "9cea903a-2896-42df-94f0-9a36a509780e" });
    }

    async connectToSession(token: string): Promise<boolean> {
        LocalStorageServiceImpl.pushToStorage(LocalStorageKeys.SESSION_TOKEN, token);
        return sendApiRequest("/sessions", "patch", { token });
    }
}

export default function sessionServiceFactory(): SessionService {
    return new SessionServiceImpl();
}
