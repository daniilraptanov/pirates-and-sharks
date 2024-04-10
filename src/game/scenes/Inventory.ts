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
        const canvasWidth = this.sys.game.canvas.width;
        const canvasHeight = this.sys.game.canvas.height;
        const inventoryWidth = 1000;
        const inventoryHeight = 180;
        const PlayerColor = 0xffe200;
    
        // Позиция прямоугольника инвентаря
        const inventoryX = (canvasWidth - inventoryWidth) / 2; // Вычисляем X-координату для центрирования
        const inventoryY = canvasHeight - inventoryHeight; // Фиксированная Y-координата, чтобы прямоугольник находился внизу
    
        // Создаем прямоугольник инвентаря
        const inventoryRect = this.add.rectangle(inventoryX, inventoryY, inventoryWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(0.3);
    
        // Рисуем горизонтальные линии таблицы
        const cellWidth = inventoryWidth / 5;
        const cellHeight = inventoryHeight / 3;
        for (let i = 1; i < 3; i++) {
            const y = inventoryY + i * cellHeight;
            const line = this.add.graphics();
            line.lineStyle(2, PlayerColor);
            line.beginPath();
            if (i == 1) {
                line.moveTo(inventoryX, y);
                line.lineTo(inventoryX + (cellWidth * 4), y);
            } else {
                line.moveTo(inventoryX + (cellWidth * 3), y);
                line.lineTo(inventoryX + (cellWidth * 4), y);
            }
            line.closePath();
            line.strokePath();
        }
    
        // Рисуем вертикальные линии таблицы
        for (let i = 1; i < 5; i++) {
            const x = inventoryX + i * cellWidth;
            const line = this.add.graphics();
            line.lineStyle(2, PlayerColor);
            line.beginPath();
            if (i != 4) {
                line.moveTo(x, inventoryY + cellHeight);
            } else {
                line.moveTo(x, inventoryY);
            }
            line.lineTo(x, inventoryY + inventoryHeight);
            line.closePath();
            line.strokePath();
        }
    
        // Рисуем рамку вокруг всей таблицы
        const borderThickness = 4;
        const borderColor = PlayerColor;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(inventoryX, inventoryY, inventoryWidth, inventoryHeight);
        
        // Добавляем нумерацию ячеек
        let cellNumber = 1;
        let Num = 1;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const cellX = inventoryX + col * cellWidth + 5; // Отступ слева
                const cellY = inventoryY + row * cellHeight + 5; // Отступ сверху
                if ([1, 6, 7, 8, 9, 14].includes(cellNumber)) {
                    this.add.text(cellX, cellY, Num.toString(), { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
                    Num++;
                }
                cellNumber++;
                
            }
        }
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
