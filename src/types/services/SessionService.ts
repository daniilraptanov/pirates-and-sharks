export interface SessionService {
    sessionToken: string;
    createSession(mapId: string): Promise<string>;
    connectToSession(token: string): Promise<boolean>;
}
