import { MapSquareType } from "../../enums/map-square-type";
import { Pirate } from "./Pirate";

export class MapSquare extends Phaser.GameObjects.Sprite {
    static SIZE = 25;

    squareType: MapSquareType;
    pirate: Pirate;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number, pirate: Pirate) {
        // TODO
        // if (!isValueInEnum(MapSquareType, color)) {
        //     return;
        // }

        super(scene, x * MapSquare.SIZE, y * MapSquare.SIZE, "");
        scene.add.existing(this);

        this.setSquareType(color);
        this.setPirate(pirate);

        this.setInteractive();
        this.on('pointerdown', this.handleClick, this);
        
        this.setTexture(this.getTextureName());
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown() && this.pirate && this.isMovable) {
            this.pirate.move(this.x, this.y);
        }
    }

    setSquareType(squareType: number) {
        this.squareType = squareType;
    }

    setPirate(pirate: Pirate) {
        this.pirate = pirate;
    }

    get isMovable() {
        return (
            this.isForest ||
            this.isBeach ||
            this.isBoatSpawnPoint ||
            this.isPlayerSpawnPoint ||
            this.isCaveSpawnPoint
        )
    }

    get isForest() {
        return this.squareType == MapSquareType.FOREST;
    }

    get isOcean() {
        return this.squareType == MapSquareType.OCEAN;
    }

    get isBeach() {
        return this.squareType == MapSquareType.BEACH;
    }

    get isRock() {
        return this.squareType == MapSquareType.ROCK;
    }

    get isLake() {
        return this.squareType == MapSquareType.LAKE;
    }

    get isBoatSpawnPoint() {
        return this.squareType == MapSquareType.BOAT_SPAWN_POINT;
    }

    get isPlayerSpawnPoint() {
        return this.squareType == MapSquareType.PLAYER_SPAWN_POINT;
    }

    get isCaveSpawnPoint() {
        return this.squareType == MapSquareType.CAVE_SPAWN_POINT;
    }

    getTextureName() {
        return (
            this.isBeach ? "sand" : ""
        )
    }
}
