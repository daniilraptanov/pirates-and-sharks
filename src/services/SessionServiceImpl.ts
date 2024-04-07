import { LocalStorageKeys } from "../enums/local-storage-keys";
import { sendApiRequest } from "../tools/send-api-request";
import { SessionService } from "../types/services/SessionService";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";

class SessionServiceImpl implements SessionService {
    get sessionToken(): string {
        return LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.SESSION_TOKEN) || "";
    }

    async createSession(): Promise<string> {
        return sendApiRequest("/sessions", "post");
    }

    async connectToSession(token: string): Promise<void> {
        LocalStorageServiceImpl.pushToStorage(LocalStorageKeys.SESSION_TOKEN, token);
        return sendApiRequest("/sessions", "patch", { token });
    }
}

export default function sessionServiceFactory(): SessionService {
    return new SessionServiceImpl();
}
