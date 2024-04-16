import { ResourceType } from "../../enums/resource-type";

export class Resource {
    private scene: Phaser.Scene;
    private selected: boolean;

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
        this.scene = scene;
        this.resourceType = resourceType;
        this.hotkey = hotkey;
        this.fullSizeOffsetX = fullSizeOffsetX;
        this.fullSizeOffsetY = fullSizeOffsetY;
        this.fullSizeOffsetWidth = fullSizeOffsetWidth;
    }

    initialize(x: number, y: number) {

    }
}

