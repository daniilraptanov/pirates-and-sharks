import  { FC, useState } from "react";
import userServiceFactory from "../services/UserServiceImpl";

interface WelcomeProps {
    setIsAuth: (value: boolean) => void;
}

const userService = userServiceFactory();

const Welcome: FC<WelcomeProps> = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleAuth = async () => {
        setError("");
        const result = isLogin 
            ? await userService.login(username, password)
            : await userService.registration(username, password);
        if (!result) {
            return setError("Ooops! Error! Check your data..");
        }
        props.setIsAuth(userServiceFactory().isAuth);  
    }

    return (
        <div>
            <h1>Welcome!</h1>
            <div>
                <h2>{isLogin ? "Login" : "Registration"}</h2>
                <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
                <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Switch to Registration" : "Switch to Login"}</button>
                <p>{error}</p>
            </div>
        </div>
    );
};

export default Welcome;
