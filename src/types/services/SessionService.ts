import { MapDTO } from "../dto/MapDTO";
import { SessionDTO } from "../dto/SessionDTO";

export interface SessionService {
    readonly sessionToken: string;
    readonly sessionMap: MapDTO;
    isCurrentUserSessionId(id: string): boolean;
    createSession(mapId: string): Promise<string>;
    connectToSession(token: string): Promise<SessionDTO>;
    setSessionMap(map: MapDTO): void;
}
