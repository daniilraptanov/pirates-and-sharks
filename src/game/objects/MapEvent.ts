import { EventType } from "../../enums/event-type";

export class MapEvent extends Phaser.GameObjects.Graphics {
    static SIZE = 5;
    private eventType: EventType;

    constructor(scene: Phaser.Scene, x: number, y: number, eventType: EventType) {
        super(scene, { x, y });
        this.eventType = eventType;

        scene.add.existing(this);

        this.setColor();
        this.fillCircle(0, 0, MapEvent.SIZE);
        this.strokeCircle(0, 0, MapEvent.SIZE);

        this.setDepth(1);
        this.setScale(1);

        this.createPulseAnimation();
    }

    
    private createPulseAnimation() {
        this.scene.tweens.add({
            targets: this,
            scale: { from: 1, to: 3 },
            duration: 1000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    get isTree() {
        return this.eventType == EventType.TREE;
    }
    
    get isCobblestone() {
        return this.eventType == EventType.COBBLESTONE;
    }
    
    get isBeast() {
        return this.eventType == EventType.BEAST;
    }
    
    get isCave() {
        return this.eventType == EventType.CAVE;
    }
    
    get isBoat() {
        return this.eventType == EventType.BOAT;
    }
    
    get isSpawnRope() {
        return this.eventType == EventType.SPAWN_ROPE;
    }
    
    get isSpawnSpear() {
        return this.eventType == EventType.SPAWN_SPEAR;
    }
    
    get isSpawnRum() {
        return this.eventType == EventType.SPAWN_RUM;
    }
    
    get isSpawnAxe() {
        return this.eventType == EventType.SPAWN_AXE;
    }
    
    get isSpawnPickaxe() {
        return this.eventType == EventType.SPAWN_PICKAXE;
    }
    
    get isSpawnShovel() {
        return this.eventType == EventType.SPAWN_SHOVEL;
    }

    get isAdvantageEvent() {
        return (
            this.isTree ||
            this.isCave ||
            this.isSpawnRope ||
            this.isSpawnSpear ||
            this.isSpawnRum ||
            this.isSpawnAxe ||
            this.isSpawnPickaxe ||
            this.isSpawnShovel
        );
    }

    get isObstacleEvent() {
        return (
            this.isCobblestone ||
            this.isBeast
        );
    }

    setColor(): this {
        const red = 0xff0000;
        const green = 0x00ff00;
        this.fillStyle(this.isObstacleEvent ? red : green);
        return this;
    }
}
