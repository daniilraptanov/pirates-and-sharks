export class MapEvent extends Phaser.GameObjects.Graphics {
    static SIZE = 5;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });

        scene.add.existing(this);

        this.fillStyle(0xff0000);
        this.fillCircle(x, y, MapEvent.SIZE);
        this.strokeCircle(x, y, MapEvent.SIZE);

        this.setDepth(1);
        this.setScale(1);

        this.createPulseAnimation();
        this.playPulseAnimation();
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

    private playPulseAnimation() {
        this.setScale(1);
    }
}
