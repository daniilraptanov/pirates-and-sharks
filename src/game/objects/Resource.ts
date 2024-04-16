import { ResourceType } from "../../enums/resource-type";

export class Resource {
    scene: Phaser.Scene;

    resourceType: ResourceType;
    hotkey: number;

    fullSizeX: number;
    fullSizeY: number;

    fullSizeOffsetX: number;
    fullSizeOffsetY: number;
    fullSizeOffsetWidth: number;

    selectedX: number;
    selectedY: number;

    constructor(
        scene: Phaser.Scene,
        resourceType: ResourceType, 
        hotkey: number,
        fullSizeOffsetX: number,
        fullSizeOffsetY: number,
        fullSizeOffsetWidth: number,
    ) {
        this.resourceType = resourceType;
        this.hotkey = hotkey;
        this.fullSizeOffsetX = fullSizeOffsetX;
        this.fullSizeOffsetY = fullSizeOffsetY;
        this.fullSizeOffsetWidth = fullSizeOffsetWidth;
    }

    initialize(x: number, y: number) {

    }
}

