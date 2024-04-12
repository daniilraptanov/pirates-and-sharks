export interface SessionService {
    sessionToken: string;
    createSession(): Promise<string>;
    connectToSession(token: string): Promise<boolean>;
}
