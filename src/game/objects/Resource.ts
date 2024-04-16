import { ResourceType } from "../../enums/resource-type";

export class Resource {
    private scene: Phaser.Scene;
    private image:Phaser.GameObjects.Image;
    selected: boolean;
    SomeSelected: boolean;
    resourceType: ResourceType;
    hotkey: string;

    fullSizeX: number;
    fullSizeY: number;

    fullSizeOffsetWidth: number;
    fullSizeOffsetHeight: number;

    SelectedSizeX: number;
    SelectedSizeY: number;

    constructor(
        scene: Phaser.Scene,
        resourceType: ResourceType, 
        hotkey: string,
        fullSizeX: number,
        fullSizeY: number,
        fullSizeOffsetWidth: number,
        fullSizeOffsetHeight: number,
        SelectedSizeX: number,
        SelectedSizeY: number,
        
    ) {
        this.scene = scene;
        this.resourceType = resourceType;
        this.hotkey = hotkey;
        this.fullSizeX = fullSizeX;
        this.fullSizeY = fullSizeY;
        this.fullSizeOffsetWidth = fullSizeOffsetWidth;
        this.fullSizeOffsetHeight = fullSizeOffsetHeight;
        this.SelectedSizeX = SelectedSizeX;
        this.SelectedSizeY = SelectedSizeY;
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.MouseOver = this.MouseOver.bind(this);
        this.MouseOut = this.MouseOut.bind(this);
        this.selected = false;
        this.SomeSelected = false;
    }

    initialize(image:string) {
        this.image = this.scene.add.image(this.fullSizeX, this.fullSizeY, image);
        this.image.setOrigin(0);
        this.image.setInteractive();
        this.image.on('pointerdown', this.handleClick);
        this.image.on('pointerover', this.MouseOver);
        this.image.on('pointerout', this.MouseOut);
        if(this.scene.input.keyboard){
        this.scene.input.keyboard.on('keydown', this.handleKeyDown);
        }
    }
    SetPosition(size:number) {
        this.image.setScale(size); 
        if (size == 1) {
            this.image.x = this.fullSizeX;
            this.image.y = this.fullSizeY;
            this.image.displayWidth = this.fullSizeOffsetWidth;
            this.image.displayHeight = this.fullSizeOffsetHeight;
        }
        else if (size == 0.5) {
            this.image.x = this.SelectedSizeX;
            this.image.y = this.SelectedSizeY;
        }
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown()) {
            this.toggleSelected();
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === this.hotkey) {
            this.toggleSelected();
        }
    }

    private MouseOver() {
        if (!this.selected && !this.SomeSelected) {
        this.SetPosition(0.5);
        }
    }

    private MouseOut() {
        if (!this.selected) {
        this.SetPosition(1);
        }
    }

    SomeSelectedCheck(CheckSomeSelected:boolean){
        if (CheckSomeSelected == true){
            this.SomeSelected = true;
        }
        else {
            this.SomeSelected = false;
        }
    }

    private toggleSelected() {
        if (!this.selected && !this.SomeSelected) {
            this.SetPosition(0.5);
            this.selected = true;
        } else {
            this.SetPosition(1);
            this.selected = false;
        }
    }
}

