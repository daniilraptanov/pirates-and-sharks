import  { FC, useEffect, useState } from "react";
import sessionServiceFactory from "../services/SessionServiceImpl";
import mapServiceFactory from "../services/MapServiceImpl";
import { observer } from "mobx-react";
import { SERVER_URL } from "../tools/send-api-request";

interface SessionConnectProps {
    setIsConnectedToSession: (value: boolean) => void;
}

const sessionService = sessionServiceFactory();
const mapService = mapServiceFactory();

const SessionConnect: FC<SessionConnectProps> = observer((props) => {
    const [sessionToken, setSessionToken] = useState(sessionService.sessionToken);
    const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

    const handleSessionToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionToken(e.target.value);
    };

    const handleSelectedMapId = (id: string) => {
        setSelectedMapId(id);
    }

    const connectToSession = async () => {
        props.setIsConnectedToSession(await sessionService.connectToSession(sessionToken));
    }

    const createSession = async () => {
        if (!selectedMapId) {
            return;
        }
        const token = await sessionService.createSession(selectedMapId);
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
                        onClick={() => handleSelectedMapId(map.id)}
                        className={selectedMapId === map.id ? "selectedMap": ""} 
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
