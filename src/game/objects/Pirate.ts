import { MapSquare } from "./MapSquare";

export class Pirate extends Phaser.GameObjects.Rectangle {
    private static SIZE = 20;
    private static DEFAULT_SCALE = 1;
    private static SELECTED_SCALE = 1.3;
    private static MOVE_DISTANCE = MapSquare.SIZE;

    private isSelected = false;

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
        } else {
            this.setScale(Pirate.DEFAULT_SCALE);
        }
    }

    move(x: number, y: number) {
        if (this.isSelected && this.isAdjacentSquare(x, y)) {
            this.setPosition(x, y);
        }
    }

    private isAdjacentSquare(x: number, y: number) {
        const distance = Phaser.Math.Distance.BetweenPoints(
            new Phaser.Geom.Point(this.x, this.y),
            new Phaser.Geom.Point(x, y)
        );
        return distance === Pirate.MOVE_DISTANCE;
    }
}
