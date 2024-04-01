import { FC, useState } from "react";

interface AuthModalProps {
    onClose: () => void; // Пропс для закрытия модального окна
}

const AuthModal: FC<AuthModalProps> = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleAuth = () => {
        if (isLogin) {
            // Обработка логики входа
            console.log("Logging in with username:", username, "and password:", password);
        } else {
            // Обработка логики регистрации
            console.log("Registering new user with username:", username, "email:", email, "and password:", password);
        }

        // После успешной операции закрываем модальное окно
        onClose();
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Registration"}</h2>
            {!isLogin && <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />}
            <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
            <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
            <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Switch to Registration" : "Switch to Login"}</button>
        </div>
    );
};

export default AuthModal;