import { LocalStorageKeys } from "../enums/local-storage-keys";
import { sendApiRequest } from "../tools/send-api-request";
import { UserService } from "../types/services/UserService";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";

class UserServiceImpl implements UserService {
    get isAuth() {
        return !!(LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.AUTH_TOKEN));
    }

    async registration(login: string, password: string): Promise<boolean> {
        return !!(await sendApiRequest("/register", "post", { login, password }));
    }

    async login(login: string, password: string): Promise<boolean> {
        LocalStorageServiceImpl.removeByKey(LocalStorageKeys.AUTH_TOKEN);
        const token = (await sendApiRequest("/login", "post", { login, password }))["token"];
        if (!token) {
            return false;
        }
        LocalStorageServiceImpl.pushToStorage(LocalStorageKeys.AUTH_TOKEN, token);
        return true;
    }
}

export default function userServiceFactory(): UserService {
    return new UserServiceImpl();
}
