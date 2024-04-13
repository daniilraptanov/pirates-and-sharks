import  { FC, useState } from "react";
import sessionServiceFactory from "../services/SessionServiceImpl";

interface SessionConnectProps {
    setIsConnectedToSession: (value: boolean) => void;
}

const sessionService = sessionServiceFactory();

const SessionConnect: FC<SessionConnectProps> = (props) => {
    const [sessionToken, setSessionToken] = useState(sessionService.sessionToken);

    const handleSessionToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionToken(e.target.value);
    };

    const connectToSession = async () => {
        props.setIsConnectedToSession(await sessionService.connectToSession(sessionToken));
    }

    const createSession = async () => {
        const token = await sessionService.createSession();
        setSessionToken(token);
    }

    return (
        <div>
            <h1>Firstly connect to Session!</h1>
            <div>
                <input type="text" placeholder="Session token" value={sessionToken} onChange={handleSessionToken} />
                <button disabled={!!!sessionToken} onClick={connectToSession}>Connect</button>
                <button onClick={createSession}>Create new session</button>
            </div>
        </div>
    );
};

export default SessionConnect;
