import { SquareCoordMapper } from "../../mappers/SquareCoordMapper";
import squareServiceFactory from "../../services/SquareServiceImpl";
import { Map } from "./Map";
import { MapEvent } from "./MapEvent";

export class Pirate extends Phaser.GameObjects.Sprite {
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

    private events: MapEvent[] = [];


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
                    this.allowedSquares.push({ x: xCoord, y: yCoord });
                }
            }
        }
    }
    
    private setVisibleSquares(x: number, y: number) {
        this.changeVisibilityArea(false);
        this.visibleSquares = [{ x: this.x, y: this.y }];
        for (let k = 1; k <= Pirate.VISIBILITY_OFFSET; k++) {
            for (let dx = k; dx >= -k; dx--) {
                for (let dy = k; dy >= -k; dy--) {
                    const coords = SquareCoordMapper.toStandard(dx, dy);
                    const data = {
                        x: x + coords.x,
                        y: y + coords.y,
                    }

                    if (Map.hasLineOfSight(x, y, data.x, data.y)) {
                        this.visibleSquares.push(data);
                    }
                }
            }
        }
        this.changeVisibilityArea(true);
        this.updateMapEventViews(x, y);
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

    private changeVisibilityArea(visible: boolean) {
        this.visibleSquares.forEach(square => {
            const mapSquare = Map.getMapSquare(square.x, square.y);
            mapSquare?.setSquareTint(visible);
        });
    }

    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        this.setAllowedSquares(x, y);
        return this;
    }

    updateMapEventViews(x: number, y: number) {
        this.events.forEach((event) => {
            event.destroy();
        });

        const squareService = squareServiceFactory();
        (async () => {
            await Promise.all(this.visibleSquares.map(async (square) => {
                const result = await squareService.saveSquare(square.x, square.y, x === square.x && y === square.y);
                if (result.square.event) {
                    this.events.push(new MapEvent(this.scene, square.x, square.y));
                }
            }));
        })();
    }

    // TODO :: use initial coordinates
    init(x: number, y: number) {
        (async () => {
            const currentPosition = (await squareServiceFactory().getAvailableSquares())
                .find((square) => square.isCurrentPosition);

            if (!currentPosition) {
                return;
            }

            this.setVisibleSquares(currentPosition.square.x, currentPosition.square.y);
            this.setPosition(currentPosition.square.x, currentPosition.square.y);
        })();
    }
}
