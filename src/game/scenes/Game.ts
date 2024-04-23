import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Map } from '../objects/Map';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    keys: any; // TODO
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        
        this.camera = this.cameras.main;
        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        Map.createMap(this);
        
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        const dampingFactor = 4;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.middleButtonDown()) {
                isDragging = true;
                startX = pointer.x;
                startY = pointer.y;
            }
        });
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (pointer.middleButtonReleased()) {
                isDragging = false;
            }
        });
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isDragging) {
                const dx = (pointer.x - startX) * dampingFactor;
                const dy = (pointer.y - startY) * dampingFactor;
                this.camera.scrollX -= dx;
                this.camera.scrollY -= dy;
                startX = pointer.x;
                startY = pointer.y;
            }
        });
        document.addEventListener('keydown', (event) => {
            const step = 40;
            switch(event.key) {
                case 'a':
                    this.camera.scrollX -= step;
                    break;
                case 'd':
                    this.camera.scrollX += step;
                    break;
                case 'w':
                    this.camera.scrollY -= step;
                    break;
                case 's':
                    this.camera.scrollY += step;
                    break;
            }
        });
        EventBus.emit('current-scene-ready', this);
        this.scene.launch('Inventory');
        this.scene.launch('EventInfo');
    }

    update() {
        let targetZoom = this.cameras.main.zoom;
        const zoom = 10 * targetZoom;
        if (this.cursors.left.isDown) {
            this.camera.scrollX -= zoom;
        } else if (this.cursors.right.isDown) {
            this.camera.scrollX += zoom;
        }

        if (this.cursors.up.isDown) {
            this.camera.scrollY -= zoom;
        } else if (this.cursors.down.isDown) {
            this.camera.scrollY += zoom;
        }
        
        const zoomIncrement = 0.5;
        const minZoom = 0.2;
        const maxZoom = 2;
        let isTweening = false;

        this.input.on('wheel', (
            _pointer: Phaser.Input.Pointer, 
            _gameObjects: Phaser.GameObjects.GameObject[], 
            _deltaX: number,
            deltaY: number, 
            _deltaZ: number
        ) => {
            if (!isTweening) {
                targetZoom = Phaser.Math.Clamp(this.cameras.main.zoom + (deltaY > 0 ? -zoomIncrement : zoomIncrement), minZoom, maxZoom);
                isTweening = true;
                this.tweens.add({
                    targets: this.cameras.main,
                    zoom: targetZoom,
                    duration: 100, 
                    onComplete: () => {
                        isTweening = false; 
                    }
                });
            }
        });
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
