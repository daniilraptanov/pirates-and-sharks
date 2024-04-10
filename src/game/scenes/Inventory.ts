import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import inventoryServiceFactory from "../../services/InventoryServiceImpl";
import { InventoryService } from "../../types/services/InventoryService";

export class Inventory extends Scene {
    inventoryService: InventoryService;

    constructor() {
        super({ key: 'Inventory' });
        this.inventoryService = inventoryServiceFactory();
    }

    create() {
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        const inventoryHeight = 200;
        const numRows = 3;
        const numCols = 5;
        const cellWidth = cameraWidth / numCols;
        const cellHeight = inventoryHeight / numRows;
        const PlayerColor = 0xffe200;
    
        // Создаем прямоугольник инвентаря
        const inventoryRect = this.add.rectangle(0, cameraHeight - inventoryHeight, cameraWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(0.3);
    
        // Рисуем горизонтальные линии таблицы
        for (let i = 1; i < numRows; i++) {
            const y = cameraHeight - inventoryHeight + i * cellHeight;
            const line = this.add.graphics();
            line.lineStyle(2, PlayerColor);
            line.beginPath();
            if (i == 1) {
                line.moveTo(0, y);
                line.lineTo(cameraWidth/5*4, y);
            }
            else {
                line.moveTo(cameraWidth/5*3, y);
                line.lineTo(cameraWidth/5*4, y);
            }
            line.closePath();
            line.strokePath();
        }
    
        // Рисуем вертикальные линии таблицы
        for (let i = 1; i < numCols; i++) {
            const x = i * cellWidth;
            const line = this.add.graphics();
            line.lineStyle(2, PlayerColor);
            line.beginPath();
            if (i != 4) {
                line.moveTo(x, cameraHeight - (inventoryHeight/3*2)+1);
            }
            else {
                line.moveTo(x, cameraHeight -inventoryHeight);
            }
            line.lineTo(x, cameraHeight);
            line.closePath();
            line.strokePath();
        }
    
        // Рисуем рамку вокруг всей таблицы
        const borderThickness = 4;
        const borderColor = PlayerColor;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(0, cameraHeight - inventoryHeight, cameraWidth, inventoryHeight);
    
        EventBus.emit('current-scene-ready', this);

        // Get data from API
        (async () => {
            const data = await this.inventoryService.getUserInventory();
            data.forEach((element) => {
                console.log(`${element.resource.name}: ${element.amount}`);
            });
        })();
    }
}
