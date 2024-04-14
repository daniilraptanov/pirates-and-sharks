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

        const PlayerColor = 0xffe200; // брать из БД
        // Заглобалить
        let Axe;
        let Shovel;
        let Pickaxe;
        let Spear;
        let Rope;
        let Rom;
        let Rom_Choise = false;
        let Rope_Choise = false;
        let Spear_Choise = false;
        let Axe_Choise = false;
        let Shovel_Choise = false;
        let Pickaxe_Choise = false;

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
        let AX = 0;
        let AY = 0;
        let PX = 0;
        let PY = 0;
        let RX = 0;
        let RY = 0;
        let RomX = 0;
        let RomY = 0;
        let ShX = 0;
        let ShY = 0;
        let SpX = 0;
        let SpY = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const cellX = inventoryX + col * cellWidth + 5; // Отступ слева
                const cellY = inventoryY + row * cellHeight + 5; // Отступ сверху
                if ([1, 6, 7, 8, 9, 14].includes(cellNumber)) {
                    this.add.text(cellX, cellY, Num.toString(), { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
                    Num++;
                    if (cellNumber === 1) {
                        Spear = this.add.image(cellX+20, cellY+7, 'Spear');
                        SpX = cellX+20;
                        SpY = cellY+7;
                        Spear.setOrigin(0);
                        Spear.setInteractive();
                        Spear.displayWidth = cellWidth*4-50;
                        Spear.displayHeight = 40;
                    }
                    if (cellNumber === 6) {
                        Axe = this.add.image(cellX, cellY, 'Axe');
                        AX = cellX;
                        AY = cellY;
                        Axe.setOrigin(0);
                        Axe.setInteractive();
                        Axe.displayWidth = cellWidth - 10;
                        Axe.displayHeight = 110;
                    }
                    else if (cellNumber === 7) {
                        Pickaxe = this.add.image(cellX, cellY, 'Pickaxe');
                        PX = cellX;
                        PY = cellY;
                        Pickaxe.setOrigin(0);
                        Pickaxe.setInteractive();
                        Pickaxe.displayWidth = cellWidth - 10; 
                        Pickaxe.displayHeight = 110; 
                    }
                    else if (cellNumber === 8) {
                        Shovel = this.add.image(cellX, cellY, 'Shovel');
                        ShX = cellX;
                        ShY = cellY;
                        Shovel.setOrigin(0);
                        Shovel.setInteractive();
                        Shovel.displayWidth = cellWidth - 10; 
                        Shovel.displayHeight = 110; 
                    }
                    else if (cellNumber === 9) {
                        Rope = this.add.image(cellX+15, cellY, 'Rope');
                        RX = cellX+15;
                        RY = cellY;
                        Rope.setOrigin(0);
                        Rope.setInteractive();
                        Rope.displayWidth = cellWidth - 30; 
                        Rope.displayHeight = cellHeight - 10; 
                    }
                    else if (cellNumber === 14) {
                        Rom = this.add.image(cellX+15, cellY, 'Rom');
                        RomX = cellX+15;
                        RomY = cellY;
                        Rom.setOrigin(0);
                        Rom.setInteractive();
                        Rom.displayWidth = cellWidth - 30; 
                        Rom.displayHeight = cellHeight - 10; 
                    }
                }
                cellNumber++;
                
            }
        }

        if (Axe) {
            Axe.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                Axe.setScale(0.5); // Установка масштаба в 0.5 относительно оригинального размера
                Axe.x = inventoryX+50;
                Axe.y = inventoryY+90;
                }
            });
            Axe.on('pointerout', () => {
                if (Axe_Choise === false){
                    Axe.setScale(1); 
                    Axe.x = AX;
                    Axe.y = AY;
                    Axe.displayWidth = cellWidth - 10;
                    Axe.displayHeight = 110;
                }
            });
            Axe.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Axe_Choise = true;
                }
                else {
                    Axe_Choise = false;
                }
            }); 
        }
        if (Pickaxe) {
            Pickaxe.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                    Pickaxe.setScale(0.5); 
                    Pickaxe.x = inventoryX+270;
                    Pickaxe.y = inventoryY+85;
                }
            });
            Pickaxe.on('pointerout', () => {
                if (Pickaxe_Choise === false){
                    Pickaxe.setScale(1); 
                    Pickaxe.x = PX;
                    Pickaxe.y = PY;
                    Pickaxe.displayWidth = cellWidth - 10;
                    Pickaxe.displayHeight = 110;
                }
            });
            Pickaxe.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Pickaxe_Choise = true;
                }
                else {
                    Pickaxe_Choise = false;
                }
            });    
        }
        if (Shovel) {
            Shovel.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                    Shovel.setScale(0.5);
                    Shovel.x = inventoryX+460;
                    Shovel.y = inventoryY+85;
                }
            });
            Shovel.on('pointerout', () => {
                if (Shovel_Choise === false){
                    Shovel.setScale(1); 
                    Shovel.x = ShX;
                    Shovel.y = ShY;
                    Shovel.displayWidth = cellWidth - 10;
                    Shovel.displayHeight = 110;
                }
            });
            Shovel.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Shovel_Choise = true;
                }
                else {
                    Shovel_Choise = false;
                }
            });    
        }
        if (Spear) {
            Spear.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                    Spear.setScale(0.5); 
                    Spear.x = inventoryX+220;
                    Spear.y = inventoryY+20;
                }
            });
            Spear.on('pointerout', () => {
                if (Spear_Choise === false){
                    Spear.setScale(1); 
                    Spear.x = SpX;
                    Spear.y = SpY;
                    Spear.displayWidth = cellWidth*4-50;
                    Spear.displayHeight = 40;
                }
            });
            Spear.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Spear_Choise = true;
                }
                else {
                    Spear_Choise = false;
                }
            });    
        }
        if (Rope) {
            Rope.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                    Rope.setScale(0.5);
                    Rope.x = inventoryX+660;
                    Rope.y = inventoryY+75;
                }
            });
            Rope.on('pointerout', () => {
                if (Rope_Choise === false){
                    Rope.setScale(1); 
                    Rope.x = RX;
                    Rope.y = RY;
                    Rope.displayWidth = cellWidth - 30; 
                    Rope.displayHeight = cellHeight - 10;
                }
            });
            Rope.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Rope_Choise = true;
                }
                else {
                    Rope_Choise = false;
                }
            });    
        }
        if (Rom) {
            Rom.on('pointerover', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                    Rom.setScale(0.5); 
                    Rom.x = inventoryX+660;
                    Rom.y = inventoryY+135;
                }
            });
            Rom.on('pointerout', () => {
                if (Rom_Choise === false){
                    Rom.setScale(1); 
                    Rom.x = RomX;
                    Rom.y = RomY;
                    Rom.displayWidth = cellWidth - 30; 
                    Rom.displayHeight = cellHeight - 10;
                }
            });
            Rom.on('pointerdown', () => {
                if (Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false){
                    Rom_Choise = true;
                }
                else {
                    Rom_Choise = false;
                }
            });    
        }

        if (Spear && Axe && Pickaxe && Shovel && Rope && Rom){
        document.addEventListener('keydown', (event) => {
            if (event.key === '1' && Shovel_Choise === false && Pickaxe_Choise === false && Rope_Choise === false && Axe_Choise === false && Rom_Choise === false) {
                if (Spear_Choise === true){
                    Spear_Choise = false;
                    Spear.setScale(1); 
                    Spear.x = SpX;
                    Spear.y = SpY;
                    Spear.displayWidth = cellWidth*4-50;
                    Spear.displayHeight = 40;
                }
                else {
                    Spear_Choise = true;
                    Spear.setScale(0.5); 
                    Spear.x = inventoryX+220;
                    Spear.y = inventoryY+20;
                }
            }
            if (event.key === '2' && Shovel_Choise === false && Pickaxe_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                if (Axe_Choise === true){
                    Axe_Choise = false;
                    Axe.setScale(1); 
                    Axe.x = AX;
                    Axe.y = AY;
                    Axe.displayWidth = cellWidth - 10;
                    Axe.displayHeight = 110;
                }
                else {
                    Axe_Choise = true;
                    Axe.setScale(0.5);
                    Axe.x = inventoryX+50;
                    Axe.y = inventoryY+90;
                }
            }
            if (event.key === '3' && Axe_Choise === false && Shovel_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                if (Pickaxe_Choise === true){
                    Pickaxe_Choise = false;
                    Pickaxe.setScale(1); 
                    Pickaxe.x = PX;
                    Pickaxe.y = PY;
                    Pickaxe.displayWidth = cellWidth - 10;
                    Pickaxe.displayHeight = 110;
                }
                else {
                    Pickaxe_Choise = true;
                    Pickaxe.setScale(0.5);
                    Pickaxe.x = inventoryX+270;
                    Pickaxe.y = inventoryY+85;
                }
            }
            if (event.key === '4' && Pickaxe_Choise === false && Axe_Choise === false && Rope_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                if (Shovel_Choise === true){
                    Shovel_Choise = false;
                    Shovel.setScale(1); 
                    Shovel.x = ShX;
                    Shovel.y = ShY;
                    Shovel.displayWidth = cellWidth - 10;
                    Shovel.displayHeight = 110;
                }
                else {
                    Shovel_Choise = true;
                    Shovel.setScale(0.5);
                    Shovel.x = inventoryX+460;
                    Shovel.y = inventoryY+85;
                }
            }
            if (event.key === '5' && Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Spear_Choise === false && Rom_Choise === false) {
                if (Rope_Choise === true){
                    Rope_Choise = false;
                    Rope.setScale(1); 
                    Rope.x = RX;
                    Rope.y = RY;
                    Rope.displayWidth = cellWidth - 30; 
                    Rope.displayHeight = cellHeight - 10;
                }
                else {
                    Rope_Choise = true;
                    Rope.setScale(0.5);
                    Rope.x = inventoryX+660;
                    Rope.y = inventoryY+75;
                }
            }
            if (event.key === '6' && Pickaxe_Choise === false && Axe_Choise === false && Shovel_Choise === false && Spear_Choise === false && Rope_Choise === false) {
                if (Rom_Choise === true){
                    Rom_Choise = false;
                    Rom.setScale(1); 
                    Rom.x = RomX;
                    Rom.y = RomY;
                    Rom.displayWidth = cellWidth - 30; 
                    Rom.displayHeight = cellHeight - 10;
                }
                else {
                    Rom_Choise = true;
                    Rom.setScale(0.5); 
                    Rom.x = inventoryX+660;
                    Rom.y = inventoryY+135;
                }
            }
        });
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
