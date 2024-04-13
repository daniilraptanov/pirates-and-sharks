import { LocalStorageKeys } from "../enums/local-storage-keys";
import { sendApiRequest } from "../tools/send-api-request";
import { SessionService } from "../types/services/SessionService";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";

class SessionServiceImpl implements SessionService {
    get sessionToken(): string {
        return LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.SESSION_TOKEN) || "";
    }

    async createSession(mapId: string): Promise<string> {
        return sendApiRequest("/sessions/create", "post", { mapId });
    }

    async connectToSession(token: string): Promise<boolean> {
        LocalStorageServiceImpl.pushToStorage(LocalStorageKeys.SESSION_TOKEN, token);
        return !!(await sendApiRequest("/sessions/connect", "post", { token }));
    }
}

export default function sessionServiceFactory(): SessionService {
    return new SessionServiceImpl();
}
