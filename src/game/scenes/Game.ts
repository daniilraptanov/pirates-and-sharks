import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { MapSquare } from '../objects/MapSquare';
import { Pirate } from '../objects/Pirate';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

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

        const img = new Image();
        img.src = "assets/map_128.png";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            if (context) {
                context.drawImage(img, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const pirate = new Pirate(this, 0, 0);

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const index = (y * canvas.width + x) * 4;
                        const red = data[index];
                        const green = data[index + 1];
                        const blue = data[index + 2];

                        const hexColor = (1 << 24) + (red << 16) + (green << 8) + blue;
                        const square = new MapSquare(this, x, y, hexColor);
                        square.setPirate(pirate);
                        if (square.isPlayerSpawnPoint) {
                            pirate.setPosition(square.x, square.y);
                        }
                    }
                }
            }
        };

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.camera.scrollX -= 4;
        } else if (this.cursors.right.isDown) {
            this.camera.scrollX += 4;
        }

        if (this.cursors.up.isDown) {
            this.camera.scrollY -= 4;
        } else if (this.cursors.down.isDown) {
            this.camera.scrollY += 4;
        }



        let isDragging = false;
        let startX = 0;
        let startY = 0;
        const dampingFactor = 0.01;

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
        const zoomIncrement = 0.5;
        const minZoom = 0.4;
        const maxZoom = 3;
        let targetZoom = this.cameras.main.zoom;
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
