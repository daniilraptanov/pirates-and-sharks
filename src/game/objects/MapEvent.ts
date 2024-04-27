import { EventType } from "../../enums/event-type";
import { EventInfo } from "../scenes/EventInfo";

export class MapEvent extends Phaser.GameObjects.Graphics {
    static SIZE = 5;
    static INTERACTIVE_SIZE = 15;
    
    static NORMAL_SCALE = 2;
    static PULSE_SCALE = 4;
    static SELECTED_SCALE = 3;
    
    private eventType: EventType;
    private pulseTween: Phaser.Tweens.Tween;
    private eventInfoScene: EventInfo;
    
    isSelected: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, eventType: EventType) {
        super(scene, { x, y });
        this.eventInfoScene = scene.scene.get('EventInfo') as EventInfo;
        this.eventType = eventType;

        scene.add.existing(this);

        this.setColor();
        this.fillCircle(0, 0, MapEvent.SIZE);
        this.strokeCircle(0, 0, MapEvent.SIZE);

        this.setDepth(1);
        this.setScale(MapEvent.NORMAL_SCALE);

        const bounds = new Phaser.Geom.Rectangle(
            -MapEvent.SIZE / 2, 
            -MapEvent.SIZE / 2, 
            MapEvent.INTERACTIVE_SIZE, 
            MapEvent.INTERACTIVE_SIZE
        );
        this.setInteractive(bounds, Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', this.handlePointerDown, this);
        this.createPulseAnimation();
    }

    private handlePointerDown() {
        this.stopPulseAnimation();
        this.eventInfoScene.setInfo(this);
    }

    handleIsSelected() {
        if (this.isSelected) {
            this.setScale(MapEvent.NORMAL_SCALE);
            this.isSelected = false;
        } else {
            this.setScale(MapEvent.SELECTED_SCALE);
            this.isSelected = true;
        }
    }
    
    private createPulseAnimation() {
        this.pulseTween = this.scene.tweens.add({
            targets: this,
            scale: { from: MapEvent.NORMAL_SCALE, to: MapEvent.PULSE_SCALE },
            duration: 1000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    stopPulseAnimation() {
        if (this.pulseTween && this.pulseTween.isPlaying()) {
            this.pulseTween.stop();
            this.setScale(MapEvent.NORMAL_SCALE);
        }
    }

    playPulseAnimation() {
        if (this.pulseTween && this.pulseTween.paused) {
            this.pulseTween.play();
        }
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

    get isSpawnEvent() {
        return (
            this.isSpawnRope ||
            this.isSpawnSpear ||
            this.isSpawnRum ||
            this.isSpawnAxe ||
            this.isSpawnPickaxe ||
            this.isSpawnShovel
        );
    }

    get isAdvantageEvent() {
        return (
            this.isTree ||
            this.isCave ||
            this.isSpawnEvent
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
