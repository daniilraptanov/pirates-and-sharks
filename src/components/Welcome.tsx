import { FC, useState } from "react";
import RegistrationModal from "./RegistrationModal";
import LoginModal from "./LoginModal";

interface WelcomeProps {}

const Welcome: FC<WelcomeProps> = (props) => {
    const [onLogin, setOnLogin] = useState(false);
    return onLogin ? (
        <RegistrationModal />
    ) : (
      <LoginModal />
    );
}

export default Welcome;