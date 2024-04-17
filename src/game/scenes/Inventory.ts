import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import inventoryServiceFactory from "../../services/InventoryServiceImpl";
import { InventoryService } from "../../types/services/InventoryService";
import { Resource } from "../objects/Resource";
import { ResourceType } from "../../enums/resource-type";

export class Inventory extends Scene {
    inventoryService: InventoryService;
    selectedResource: Resource | null;

    spear: Resource;
    axe: Resource;
    pickaxe: Resource;
    shovel: Resource;
    rope: Resource;
    rum: Resource;

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

        // Position of the inventory rectangle
        const inventoryX = (canvasWidth - inventoryWidth) / 2; // Calculate the X coordinate for centering
        const inventoryY = canvasHeight - inventoryHeight; // Fixed Y coordinate so the rectangle is at the bottom

        const cellWidth = inventoryWidth / 5;
        const cellHeight = inventoryHeight / 3;
        
        this.spear = new Resource(this, ResourceType.SPEAR, "1", inventoryX+10, inventoryY+10, cellWidth*4-50, 40,inventoryX+220,inventoryY+20);
        this.axe = new Resource(this, ResourceType.AXE, "2", inventoryX+5, inventoryY+65, cellWidth - 10, 110,inventoryX+55,inventoryY+90);
        this.pickaxe = new Resource(this, ResourceType.PICKAXE, "3", inventoryX+205, inventoryY+65, cellWidth - 10, 110,inventoryX+270,inventoryY+85);
        this.shovel = new Resource(this, ResourceType.SHOVEL, "4", inventoryX+405, inventoryY+65, cellWidth - 10, 110,inventoryX+460,inventoryY+85);
        this.rope = new Resource(this, ResourceType.ROPE, "5", inventoryX+615, inventoryY+65, cellWidth - 30, cellHeight - 10,inventoryX+660,inventoryY+75);
        this.rum = new Resource(this, ResourceType.RUM, "6", inventoryX+605, inventoryY+125, cellWidth - 10, cellHeight - 10 ,inventoryX+660,inventoryY+135);

        // Create an inventory rectangle
        const inventoryRect = this.add.rectangle(inventoryX, inventoryY, inventoryWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(0.3);
       
        // Drawing horizontal lines of the table
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
    
        // Drawing vertical lines of the table
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
    
        // Draw a frame around the entire table
        const borderThickness = 4;
        const borderColor = PlayerColor;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(inventoryX, inventoryY, inventoryWidth, inventoryHeight);
        
        // Add cell numbering
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
                        this.spear.initialize('Spear');
                        this.spear.setPosition(1);
                    }
                    if (cellNumber === 6) {
                        this.axe.initialize('Axe');
                        this.axe.setPosition(1);
                    }
                    else if (cellNumber === 7) {
                        this.pickaxe.initialize('Pickaxe');
                        this.pickaxe.setPosition(1);
                    }
                    else if (cellNumber === 8) {
                        this.shovel.initialize('Shovel');
                        this.shovel.setPosition(1);
                    }
                    else if (cellNumber === 9) {
                        this.rope.initialize('Rope');
                        this.rope.setPosition(1);
                    }
                    else if (cellNumber === 14) {
                        this.rum.initialize('Rom');
                        this.rum.setPosition(1);
                    }
                }
                cellNumber++;
            }
        }

        document.addEventListener("keydown", (_event) => {
            this.updateSelectedResource();
        });
        document.addEventListener("mousedown", (_event) => {
            this.updateSelectedResource();
        });
        EventBus.emit('current-scene-ready', this);

        // TODO
        // Get data from API
        (async () => {
            const data = await this.inventoryService.getUserInventory();
            data.forEach((element) => {
                console.log(`${element.resource.name}: ${element.amount}`);
            });
        })();
    }
    
    EventStart() {}

    private updateSelectedResource() {
        this.selectedResource = 
            this.axe.selected ? this.axe :
            this.spear.selected ? this.spear :
            this.pickaxe.selected ? this.pickaxe :
            this.shovel.selected ? this.shovel :
            this.rope.selected ? this.rope :
            this.rum.selected ? this.rum : null;

        const isSomeSelected = !!this.selectedResource;
        this.spear.someSelectedCheck(isSomeSelected);
        this.axe.someSelectedCheck(isSomeSelected);
        this.pickaxe.someSelectedCheck(isSomeSelected);
        this.shovel.someSelectedCheck(isSomeSelected);
        this.rope.someSelectedCheck(isSomeSelected);
        this.rum.someSelectedCheck(isSomeSelected);
    }
}
