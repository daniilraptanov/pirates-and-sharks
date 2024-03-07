import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.title = this.add.text(512, 460, 'Pirates&Sharks', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.title,
            y: 470,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.title.setInteractive();
        
        this.title.on('pointerdown', () => {
            this.changeScene();
        });

        this.title.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            this.title.setY(460);
        });

        this.title.on('pointerout', () => {
            this.input.setDefaultCursor('auto');
            this.title.setY(470);
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
