import  { FC, useState } from "react";
import sessionServiceFactory from "../services/SessionServiceImpl";

interface SessionConnectProps {}

const sessionService = sessionServiceFactory();

const SessionConnect: FC<SessionConnectProps> = (props) => {
    const [sessionToken, setSessionToken] = useState(sessionService.sessionToken);

    const handleSessionToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionToken(e.target.value);
    };

    const connectToSession = async () => {
        const result = sessionService.connectToSession(sessionToken);
        // if (!result) {
        //     return setError("Ooops! Error! Check your data..");
        // }
        // props.setIsAuth(userServiceFactory().isAuth);  
    }

    return (
        <div>
            <h1>Connect to Session!</h1>
            {/* <div>
                <h2>{isLogin ? "Login" : "Registration"}</h2>
                <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
                <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Switch to Registration" : "Switch to Login"}</button>
                <p>{error}</p>
            </div> */}
        </div>
    );
};

export default Welcome;
