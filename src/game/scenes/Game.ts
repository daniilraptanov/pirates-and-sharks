import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

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

                // for (let i = 0; i < data.length; i += 4) {
                //     const red = data[i];
                //     const green = data[i + 1];
                //     const blue = data[i + 2];

                //     const hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);

                //     // console.log(hexColor);
                // }
                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        const index = (y * canvas.width + x) * 4;
                        const red = data[index];
                        const green = data[index + 1];
                        const blue = data[index + 2];

                        // TODO
                        const hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
                        const hexColorNumber = parseInt(hexColor.replace(/^#/, ''), 16);
                        const square = this.add.rectangle(x * 25, y * 25, 25, 25, hexColorNumber);
                        square.setStrokeStyle(1, 0x000000);
                    }
                }
            }  
        };


        // for (let x = 0; x < 128; x++) {
        //     for (let y = 0; y < 128; y++) {
        //         const square = this.add.rectangle(x * 25, y * 25, 25, 25, 0x00ff00);
        //         square.setStrokeStyle(1, 0x000000);
        //     }
        // }

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



        const zoomIncrement = 1;
        const minZoom = 1;
        const maxZoom = 10;

        this.input.on('wheel', (
            _pointer: Phaser.Input.Pointer, 
            _gameObjects: Phaser.GameObjects.GameObject[], 
            _deltaX: number,
            deltaY: number, 
            _deltaZ: number
        ) => {
            if (deltaY > 0 && this.camera.zoom > minZoom) {
                this.camera.zoom = Phaser.Math.Clamp(this.camera.zoom - zoomIncrement, minZoom, maxZoom);
            } else if (deltaY < 0 && this.camera.zoom < maxZoom) {
                this.camera.zoom = Phaser.Math.Clamp(this.camera.zoom + zoomIncrement, minZoom, maxZoom);
            }
        });
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
