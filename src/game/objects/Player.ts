export class Player extends Phaser.GameObjects.Sprite {
    private static DEFAULT_SCALE = 1;
    private userSessionId: string;

    constructor(scene: Phaser.Scene, x: number, y: number, userSessionId: string) {
        super(scene, x, y, "");
        scene.add.existing(this);
        this.userSessionId = userSessionId;
        this.setScale(Player.DEFAULT_SCALE);
        this.setDepth(1);
        this.setTexture("pirate");
    }

    checkUserSessionId(userSessionId: string) {
        return this.userSessionId === userSessionId;
    }
}
