import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import inventoryServiceFactory from "../../services/InventoryServiceImpl";

export class Inventory extends Scene {
    constructor() {
        super({ key: 'Inventory' });
    }

    create() {
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        
        const inventoryRect = this.add.rectangle(0, 0, cameraWidth, 200, 0x000000);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(0.7);

        inventoryRect.y = cameraHeight - inventoryRect.height;

        const borderThickness = 4;
        const borderColor = 0xffffff;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(0, cameraHeight - inventoryRect.height, cameraWidth, 200);

        EventBus.emit('current-scene-ready', this);

        // Get data from API
        const data = (async () => await inventoryServiceFactory().getUserInventory())();
    }
}
