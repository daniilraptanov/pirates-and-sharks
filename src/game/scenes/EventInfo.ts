import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class EventInfo extends Scene
{
    image:Phaser.GameObjects.Image;
    constructor ()
    {
        super('EventInfo');
    }

    create ()
    {
        // вкл/выкл
        let ViewInfoBar = true;
        let ViewBorder;
        let ViewFill;
        if (ViewInfoBar == true) {
            ViewBorder = 1;
            ViewFill = 0.3;
        }
        else if (ViewInfoBar == false) {
            ViewBorder = 0;
            ViewFill = 0;
        }
        const inventoryWidth = 300;
        const inventoryHeight = 450;
        const PlayerColor = 0xffe200;
        //Прямоугольник с рамкой
        const inventoryRect = this.add.rectangle(0, 0, inventoryWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(ViewFill);
        const borderThickness = 4;
        const borderColor = PlayerColor;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(3, 3, inventoryWidth, inventoryHeight);
        borderRect.setAlpha(ViewBorder);
        //Полоски
        for (let i = 1; i < 3; i++) {
            const line = this.add.graphics();
            line.lineStyle(4, PlayerColor);
            line.beginPath();
            if (i == 1) {
                line.moveTo(1, 50);
                line.lineTo(301, 50);
            } else {
                line.moveTo(1, 350);
                line.lineTo(301, 350);
            }
            line.setAlpha(ViewBorder);
            line.closePath();
            line.strokePath();
        }
        //Пикча
        this.image = this.add.image(5,51,"+Spear");
        this.image.setOrigin(0);
        this.image.setInteractive();
        this.image.displayWidth = inventoryWidth-4;
        this.image.displayHeight = inventoryWidth-2;
        this.image.setAlpha(ViewBorder);
        //Тексты
        const EventName = this.add.text(8, 15, "Название", { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
        EventName.setAlpha(ViewBorder);
        const EventOverview = this.add.text(8, 355, "Описание", { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
        EventOverview.setAlpha(ViewBorder);
        EventBus.emit('current-scene-ready', this);
    }
}