import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import inventoryServiceFactory from "../../services/InventoryServiceImpl";
import { InventoryService } from "../../types/services/InventoryService";
import { Resource } from "../objects/Resource";
import { ResourceType } from "../../enums/resource-type";

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
        const PlayerColor = 0xffe200; // брать из БД

        // Позиция прямоугольника инвентаря
        const inventoryX = (canvasWidth - inventoryWidth) / 2; // Вычисляем X-координату для центрирования
        const inventoryY = canvasHeight - inventoryHeight; // Фиксированная Y-координата, чтобы прямоугольник находился внизу

        const cellWidth = inventoryWidth / 5;
        const cellHeight = inventoryHeight / 3;
        // TODO
        const spear = new Resource(this, ResourceType.SPEAR, "1", inventoryX+10, inventoryY+10, cellWidth*4-50, 40,inventoryX+220,inventoryY+20);
        const axe = new Resource(this, ResourceType.AXE, "2", inventoryX+5, inventoryY+65, cellWidth - 10, 110,inventoryX+55,inventoryY+90);
        const pickaxe = new Resource(this, ResourceType.PICKAXE, "3", inventoryX+205, inventoryY+65, cellWidth - 10, 110,inventoryX+270,inventoryY+85);
        const shovel = new Resource(this, ResourceType.SHOVEL, "4", inventoryX+405, inventoryY+65, cellWidth - 10, 110,inventoryX+460,inventoryY+85);
        const rope = new Resource(this, ResourceType.ROPE, "5", inventoryX+615, inventoryY+65, cellWidth - 30, cellHeight - 10,inventoryX+660,inventoryY+75);
        const rum = new Resource(this, ResourceType.RUM, "6", inventoryX+605, inventoryY+125, cellWidth - 10, cellHeight - 10 ,inventoryX+660,inventoryY+135);

        // Создаем прямоугольник инвентаря
        const inventoryRect = this.add.rectangle(inventoryX, inventoryY, inventoryWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(0.3);
       
        // Рисуем горизонтальные линии таблицы
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
                const cellX = inventoryX + col * cellWidth + 5;
                const cellY = inventoryY + row * cellHeight + 5;
                if ([1, 6, 7, 8, 9, 14].includes(cellNumber)) {
                    this.add.text(cellX, cellY, Num.toString(), { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
                    Num++;
                    if (cellNumber === 1) {
                        spear.initialize('Spear');
                        spear.SetPosition(1);
                    }
                    if (cellNumber === 6) {
                        axe.initialize('Axe');
                        axe.SetPosition(1);
                    }
                    else if (cellNumber === 7) {
                        pickaxe.initialize('Pickaxe');
                        pickaxe.SetPosition(1);
                    }
                    else if (cellNumber === 8) {
                        shovel.initialize('Shovel');
                        shovel.SetPosition(1);
                    }
                    else if (cellNumber === 9) {
                        rope.initialize('Rope');
                        rope.SetPosition(1);
                    }
                    else if (cellNumber === 14) {
                        rum.initialize('Rom');
                        rum.SetPosition(1);
                    }
                }
                cellNumber++;
            }
        }
        let SomeSelected;
        document.addEventListener("keydown", function(event) {
            if(!axe.selected && !spear.selected && !pickaxe.selected && !shovel.selected && !rope.selected && !rum.selected) {
                SomeSelected = false;
            }
            else {
                SomeSelected = true;
            }
            spear.SomeSelectedCheck(SomeSelected);
            axe.SomeSelectedCheck(SomeSelected);
            pickaxe.SomeSelectedCheck(SomeSelected);
            shovel.SomeSelectedCheck(SomeSelected);
            rope.SomeSelectedCheck(SomeSelected);
            rum.SomeSelectedCheck(SomeSelected);
        });
        document.addEventListener("mousedown", function(event) {
            if(!axe.selected && !spear.selected && !pickaxe.selected && !shovel.selected && !rope.selected && !rum.selected) {
                SomeSelected = false;
            }
            else {
                SomeSelected = true;
            }
            spear.SomeSelectedCheck(SomeSelected);
            axe.SomeSelectedCheck(SomeSelected);
            pickaxe.SomeSelectedCheck(SomeSelected);
            shovel.SomeSelectedCheck(SomeSelected);
            rope.SomeSelectedCheck(SomeSelected);
            rum.SomeSelectedCheck(SomeSelected);
          });
        EventBus.emit('current-scene-ready', this);

        // Get data from API
        (async () => {
            const data = await this.inventoryService.getUserInventory();
            data.forEach((element) => {
                console.log(`${element.resource.name}: ${element.amount}`);
            });
        })();
    }
    EventStart(){
        
    }
}
