import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { MapEvent } from "../objects/MapEvent";

export class EventInfo extends Scene
{
    selectedMapEvent: MapEvent;
    image: Phaser.GameObjects.Image;
    name: Phaser.GameObjects.Text;
    overview: Phaser.GameObjects.Text;

    constructor ()
    {
        super('EventInfo');
    }

    create ()
    {
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
        
        const inventoryRect = this.add.rectangle(0, 0, inventoryWidth, inventoryHeight, PlayerColor);
        inventoryRect.setOrigin(0);
        inventoryRect.setAlpha(ViewFill);
        const borderThickness = 4;
        const borderColor = PlayerColor;
        const borderRect = this.add.graphics();
        borderRect.lineStyle(borderThickness, borderColor);
        borderRect.strokeRect(3, 3, inventoryWidth, inventoryHeight);
        borderRect.setAlpha(ViewBorder);
      
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
       
        this.image = this.add.image(5, 51, "-Pickaxe");
        this.image.setOrigin(0);
        this.image.setInteractive();
        this.image.displayWidth = inventoryWidth - 4;
        this.image.displayHeight = inventoryWidth - 2;
        this.image.setAlpha(ViewBorder);
        
        this.name = this.add.text(8, 15, "", { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
        this.name.setAlpha(ViewBorder);
        this.overview = this.add.text(8, 355, "", { color: '#000000', fontFamily:'sans-serif', fontSize: '20px' });
        this.overview.setAlpha(ViewBorder);

        EventBus.emit('current-scene-ready', this);
    }

    changeSelectedMapEvent(mapEvent: MapEvent) {
        mapEvent.handleIsSelected();
        this.selectedMapEvent?.handleIsSelected();
        this.selectedMapEvent = mapEvent;
    }

    setInfo(mapEvent: MapEvent) {
        this.changeSelectedMapEvent(mapEvent);
        
        this.image.setTexture(
            mapEvent.isCobblestone ? "-Pickaxe" :
            mapEvent.isBeast ? "-Spear" :
            mapEvent.isSpawnAxe ? "+Axe" :
            mapEvent.isSpawnPickaxe ? "+Pickaxe" :
            mapEvent.isSpawnRope ? "+Rope" :
            mapEvent.isSpawnRum ? "+Rum" :
            mapEvent.isSpawnSpear ? "+Spear" : ""
        );

        this.name.setText(
            mapEvent.isCobblestone ? "Cobblestone" :
            mapEvent.isBeast ? "Beast" :
            mapEvent.isSpawnAxe ? "Axe" :
            mapEvent.isSpawnPickaxe ? "Pickaxe" :
            mapEvent.isSpawnRope ? "Rope" :
            mapEvent.isSpawnRum ? "Rum" :
            mapEvent.isSpawnSpear ? "Spear" : ""
        );

        this.overview.setText(
            mapEvent.isCobblestone ? "Cobblestone" :
            mapEvent.isBeast ? "Beast" :
            mapEvent.isSpawnAxe ? "Axe" :
            mapEvent.isSpawnPickaxe ? "Pickaxe" :
            mapEvent.isSpawnRope ? "Rope" :
            mapEvent.isSpawnRum ? "Rum" :
            mapEvent.isSpawnSpear ? "Spear" : ""
        );
    }
}