import { Map } from "./Map";
import { MapSquare } from "./MapSquare";

export class Pirate extends Phaser.GameObjects.Rectangle {
    private static SIZE = 20;
    private static DEFAULT_SCALE = 1;
    private static SELECTED_SCALE = 1.3;

    private isSelected = false;

    private allowedSquares: { x: number, y: number }[] = [];
    private possibleTurns: Phaser.GameObjects.Arc[] = [];


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Pirate.SIZE, Pirate.SIZE, 0xffffff);
        scene.add.existing(this);
        this.setStrokeStyle(1, 0x000000);
        this.setScale(Pirate.DEFAULT_SCALE);
        this.setDepth(1);

        this.setInteractive();
        this.on('pointerdown', this.handleClick, this);
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown()) {
            this.isSelected = !this.isSelected;
        }

        if (this.isSelected) {
            this.setScale(Pirate.SELECTED_SCALE);
            this.renderCircles();
        } else {
            this.setScale(Pirate.DEFAULT_SCALE);
            this.clearCircles();
        }
    }

    move(x: number, y: number) {
        if (this.isSelected && this.isAllowedSquare(x, y)) {
            this.setPosition(x, y);
            this.renderCircles();
        }
    }

    private isAllowedSquare(x: number, y: number) {
        for (let square of this.allowedSquares) {
            if (square.x === x && square.y === y) {
                return true;
            }
        }
        return false;
    }

    private setAllowedSquares(x: number, y: number) {
        this.allowedSquares = [];

        const offsets = [
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: -1 }, // forward
            { dx: 0, dy: 1 }   // backward
        ];
    
        for (const offset of offsets) {
            const xCoord = x + offset.dx * MapSquare.SIZE;
            const yCoord = y + offset.dy * MapSquare.SIZE;
            this.allowedSquares.push({ x: xCoord, y: yCoord });
        }
    }

    private renderCircles() {
        this.clearCircles();

        // TODO :: save allowed squares as MapSquare[]
        this.allowedSquares.forEach(square => {
            const mapSquare = Map.getMapSquare(square.x, square.y);
            if (!mapSquare.isMovable) {
                return;
            }
            const circle = this.scene.add.circle(square.x, square.y, 5, 0xffffff);
            this.possibleTurns.push(circle);
        });
    }

    private clearCircles() {
        this.possibleTurns.forEach(circle => circle.destroy());
        this.possibleTurns = [];
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        this.setAllowedSquares(x, y);
        return this;
    }

    // private isAdjacentSquare(x: number, y: number) {
    //     const distance = Phaser.Math.Distance.BetweenPoints(
    //         new Phaser.Geom.Point(this.x, this.y),
    //         new Phaser.Geom.Point(x, y)
    //     );
    //     return distance === Pirate.MOVE_DISTANCE;
    // }
}
