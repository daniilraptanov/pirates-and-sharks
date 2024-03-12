import { Map } from "./Map";
import { MapSquare } from "./MapSquare";

export class Pirate extends Phaser.GameObjects.Rectangle {
    private static SIZE = 20;
    private static DEFAULT_SCALE = 1;
    private static SELECTED_SCALE = 1.3;

    private static TURN_OFFSET = 2;
    private static VISIBILITY_OFFSET = 3;

    private isSelected = false;

    // TODO :: save squares as MapSquare[]
    private allowedSquares: { x: number, y: number }[] = [];
    private visibleSquares: { x: number, y: number }[] = [];

    private possibleTurns: Phaser.GameObjects.Arc[] = [];


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Pirate.SIZE, Pirate.SIZE, 0xffffff);
        scene.add.existing(this);
        this.setScale(Pirate.DEFAULT_SCALE);
        this.setDepth(1);

        this.setInteractive();
        this.on('pointerdown', this.handleClick, this);
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown()) {
            this.changeIsSelected();
        }

        this.selectedHandler();
    }

    changeIsSelected() {
        this.isSelected = !this.isSelected;
    }

    selectedHandler() {
        if (this.isSelected) {
            this.setScale(Pirate.SELECTED_SCALE);
            this.renderPossibleTurnsCircles();
        } else {
            this.setScale(Pirate.DEFAULT_SCALE);
            this.clearPossibleTurnsCircles();
        }
    }

    move(x: number, y: number) {
        if (this.isSelected && this.isAllowedSquare(x, y)) {
            this.setPosition(x, y);
            this.renderPossibleTurnsCircles();
            this.changeVisibilityArea();

            this.changeIsSelected();
            this.selectedHandler();
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
        for (let k = 1; k <= Pirate.TURN_OFFSET; k++) {
            const offsets = [
                { dx: -k, dy: 0 }, // left
                { dx: k, dy: 0 },  // right
                { dx: 0, dy: -k }, // forward
                { dx: 0, dy: k }   // backward
            ];
            for (const offset of offsets) {
                const xCoord = x + offset.dx * MapSquare.SIZE;
                const yCoord = y + offset.dy * MapSquare.SIZE;
                this.allowedSquares.push({ x: xCoord, y: yCoord });
            }
        }
    }
    
    private setVisibleSquares(x: number, y: number) {
        this.visibleSquares = [{ x: this.x, y: this.y }];
        for (let k = 1; k <= Pirate.VISIBILITY_OFFSET; k++) {
            for (let dx = -k; dx <= k; dx++) {
                for (let dy = -k; dy <= k; dy++) {
                    if (dx !== 0 || dy !== 0) {
                        const xCoord = x + dx * MapSquare.SIZE;
                        const yCoord = y + dy * MapSquare.SIZE;
                        this.visibleSquares.push({ x: xCoord, y: yCoord });
                    }
                }
            }
        }
    }

    private renderPossibleTurnsCircles() {
        this.clearPossibleTurnsCircles();

        this.allowedSquares.forEach(square => {
            const mapSquare = Map.getMapSquare(square.x, square.y);
            if (!mapSquare?.isMovable) {
                return;
            }
            const circle = this.scene.add.circle(square.x, square.y, 5, 0xffffff);
            this.possibleTurns.push(circle);
        });
    }

    private clearPossibleTurnsCircles() {
        this.possibleTurns.forEach(circle => circle.destroy());
        this.possibleTurns = [];
    }

    private changeVisibilityArea() {
        this.visibleSquares.forEach(square => {
            const mapSquare = Map.getMapSquare(square.x, square.y);
            mapSquare.setSquareTint(true);
        });
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        this.setAllowedSquares(x, y);
        this.setVisibleSquares(x, y);
        return this;
    }
}
