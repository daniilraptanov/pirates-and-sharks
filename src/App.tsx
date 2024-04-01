import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { observer } from 'mobx-react';
import Welcome from './components/Welcome';

const App = observer(() =>
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

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

    return (
        <div id="app">
            <Welcome />
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    )
});

export default App;
