import { SquareCoordMapper } from "../../mappers/SquareCoordMapper";
import squareServiceFactory from "../../services/SquareServiceImpl";
import { Map } from "./Map";
import { MapSquare } from "./MapSquare";

export class Pirate extends Phaser.GameObjects.Sprite {
    private static SIZE = 20;
    private static DEFAULT_SCALE = 1;
    private static SELECTED_SCALE = 1.3;

    private static TURN_OFFSET = 2;
    private static VISIBILITY_OFFSET = 3;

    private isSelected = false;

    private allowedSquares: MapSquare[] = [];
    private visibleSquares: MapSquare[] = [];

    private possibleTurns: Phaser.GameObjects.Arc[] = [];


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x * Pirate.SIZE, y * Pirate.SIZE, "");
        scene.add.existing(this);
        this.setScale(Pirate.DEFAULT_SCALE);
        this.setDepth(1);

        this.setInteractive();
        this.on('pointerdown', this.handleClick, this);

        this.setTexture("pirate");
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
            this.setVisibleSquares(x, y);
            this.setPosition(x, y);
            this.renderPossibleTurnsCircles();

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
                const coords = SquareCoordMapper.toStandard(offset.dx, offset.dy);
                const xCoord = x + coords.x;
                const yCoord = y + coords.y;

                if (Map.hasLineOfSight(x, y, xCoord, yCoord)) {
                    this.allowedSquares.push(Map.getMapSquare(xCoord, yCoord));
                }
            }
        }
    }
    
    private setVisibleSquares(x: number, y: number) {
        this.changeVisibilityArea(false);
        this.deleteMapEventsViews();
        this.visibleSquares = [Map.getMapSquare(this.x, this.y)];
        for (let k = 1; k <= Pirate.VISIBILITY_OFFSET; k++) {
            for (let dx = k; dx >= -k; dx--) {
                for (let dy = k; dy >= -k; dy--) {
                    const coords = SquareCoordMapper.toStandard(dx, dy);
                    const mapSquare = Map.getMapSquare(x + coords.x, y + coords.y);
                    if (Map.hasLineOfSight(x, y, mapSquare.x, mapSquare.y)) {
                        this.visibleSquares.push(mapSquare);
                    }
                }
            }
        }
        this.changeVisibilityArea(true);
    }

    private renderPossibleTurnsCircles() {
        this.clearPossibleTurnsCircles();

        this.allowedSquares.forEach(mapSquare => {
            if (!mapSquare?.isMovable) {
                return;
            }
            const circle = this.scene.add.circle(mapSquare.x, mapSquare.y, 5, 0xffffff);
            this.possibleTurns.push(circle);
        });
    }

    private clearPossibleTurnsCircles() {
        this.possibleTurns.forEach(circle => circle.destroy());
        this.possibleTurns = [];
    }

    private changeVisibilityArea(visible: boolean) {
        this.visibleSquares.forEach(mapSquare => {
            mapSquare?.setSquareTint(visible);
        });
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        this.setAllowedSquares(x, y);
        return this;
    }

    deleteMapEventsViews() {
        this.visibleSquares.forEach((mapSquare) => {
            mapSquare.disableMapEvent();
        });
    }

    init(x: number, y: number) {
        (async () => {
            const currentPosition = (await squareServiceFactory().getAvailableSquares())
                .find((square) => square.isCurrentPosition);

            if (currentPosition) {
                x = currentPosition.square.x;
                y = currentPosition.square.y;
            }

            this.setVisibleSquares(x, y);
            this.setPosition(x, y);
        })();
    }
}
