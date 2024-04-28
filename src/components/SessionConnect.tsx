import  { FC, useEffect, useState } from "react";
import sessionServiceFactory from "../services/SessionServiceImpl";
import mapServiceFactory from "../services/MapServiceImpl";
import { observer } from "mobx-react";
import { SERVER_URL } from "../tools/send-api-request";
import { MapDTO } from "../types/dto/MapDTO";
import { MessageServiceImpl } from "../services/MessageServiceImpl";
import { Map } from "../game/objects/Map";

interface SessionConnectProps {
    setIsConnectedToSession: (value: boolean) => void;
}

const sessionService = sessionServiceFactory();
const mapService = mapServiceFactory();

const SessionConnect: FC<SessionConnectProps> = observer((props) => {
    const [sessionToken, setSessionToken] = useState(sessionService.sessionToken);
    const [selectedMap, setSelectedMap] = useState<MapDTO | null>(null);

    const handleSessionToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionToken(e.target.value);
    };

    const handleSelectedMap = (map: MapDTO) => {
        setSelectedMap(map);
    }

    const connectToSession = async () => {
        const session = await sessionService.connectToSession(sessionToken);
        props.setIsConnectedToSession(!!session);
        sessionService.setSessionMap(mapService.findMapById(session.mapId) as MapDTO);
        MessageServiceImpl.initialize((data) => Map.updatePlayersPositions(data));
    }

    const createSession = async () => {
        if (!selectedMap) {
            return;
        }
        const token = await sessionService.createSession(selectedMap.id);
        setSessionToken(token);
    }

    useEffect(() => {
        (async () => await mapService.getMaps())();
    }, []);

    return (
        <div>
            {
                !sessionToken ? mapService.maps.map((map) => (
                    <img
                        onClick={() => handleSelectedMap(map)}
                        className={selectedMap?.id === map.id ? "selectedMap": ""} 
                        key={map.id} 
                        src={SERVER_URL + map.source} 
                        alt="" 
                    />
                )) : <></>
            }
            <h1>Firstly connect to Session!</h1>
            <div>
                <input type="text" placeholder="Session token" value={sessionToken} onChange={handleSessionToken} />
                <button disabled={!!!sessionToken} onClick={connectToSession}>Connect</button>
                <button onClick={createSession}>Create new session</button>
            </div>
        </div>
    );
});

export default SessionConnect;
