import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { observer } from 'mobx-react';
import Welcome from './components/Welcome';
import userServiceFactory from './services/UserServiceImpl';
import SessionConnect from './components/SessionConnect';
import { MessageServiceImpl } from './services/MessageServiceImpl';

const App = observer(() =>
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [isConnectedToSession, setIsConnectedToSession] = useState(false);

    // const changeScene = () => {

    //     if(phaserRef.current)
    //     {     
    //         const scene = phaserRef.current.scene as MainMenu;
            
    //         if (scene)
    //         {
    //             scene.changeScene();
    //         }
    //     }
    // }

  
    // Event emitted from the PhaserGame component
    const currentScene = (_scene: Phaser.Scene) => {};

    useEffect(() => {
        setIsAuth(userServiceFactory().isAuth);
        MessageServiceImpl.initialize((data) => {
            console.log("DATA => ", data); // TODO
        });
    }, []);

    return (
        <div id="app">
            {!isAuth 
                ? <Welcome setIsAuth={setIsAuth} />
                : 
                    !isConnectedToSession 
                        ? <SessionConnect setIsConnectedToSession={setIsConnectedToSession} />
                        : <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            }
        </div>
    )
});

export default App;
