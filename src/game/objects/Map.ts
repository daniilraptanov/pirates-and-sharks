import { MapSquare } from "./MapSquare";
import { Pirate } from "./Pirate";

export class Map {
    private static mapWidth = 128;
    private static mapSquares: MapSquare[] = [];

    static getMapSquare(x: number, y: number): MapSquare {
        const index = Math.floor(x / MapSquare.SIZE) + Math.floor(y / MapSquare.SIZE) * Map.mapWidth;
        return Map.mapSquares[index];
    }

    static createMap(scene: Phaser.Scene) {
        const img = new Image();
        img.src = `assets/maps/map_${Map.mapWidth}.png`;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            if (context) {
                context.drawImage(img, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const pirate = new Pirate(scene, 0, 0);

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const index = (y * canvas.width + x) * 4;
                        const red = data[index];
                        const green = data[index + 1];
                        const blue = data[index + 2];

                        const hexColor = (1 << 24) + (red << 16) + (green << 8) + blue;
                        const square = new MapSquare(scene, x, y, hexColor, pirate);
                        if (square.isPlayerSpawnPoint) {
                            pirate.setPosition(square.x, square.y);
                        }
                        Map.mapSquares.push(square);
                    }
                }
            }
        };
    }
}

