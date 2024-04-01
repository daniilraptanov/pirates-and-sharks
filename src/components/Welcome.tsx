import  { FC, useState } from "react";
import AuthModal from "./AuthModal";

interface WelcomeProps {}

const Welcome: FC<WelcomeProps> = () => {
    const [showAuth, setShowAuth] = useState(false);

    const handleToggleAuth = () => {
        setShowAuth(!showAuth);
    };

    return (
        <div>
            <h1>Welcome!</h1>
            <button onClick={handleToggleAuth}>Open Auth Modal</button>
            {showAuth && <AuthModal onClose={handleToggleAuth} />}
        </div>
    );
};

export default Welcome;
