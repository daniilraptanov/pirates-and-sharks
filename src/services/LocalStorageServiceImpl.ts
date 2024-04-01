import { LocalStorageKeys } from "../enums/local-storage-keys";

export class LocalStorageServiceImpl {
    static pushToStorage(key: LocalStorageKeys, value: string): void {
        localStorage.setItem(key, value);
    }

    static pullFromStorage(key: LocalStorageKeys): string | null {
        return localStorage.getItem(key);
    }

    static removeByKey(key: LocalStorageKeys): void {
        localStorage.removeItem(key);
    }
}

export default function localStorageServiceFactory() {
    return new LocalStorageServiceImpl();
}
