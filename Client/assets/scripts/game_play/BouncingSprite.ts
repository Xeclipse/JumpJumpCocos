import { _decorator, Component, Node, input, Input, Vec3, KeyCode, EventKeyboard } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BouncingSprite')
export class BouncingSprite extends Component {
    @property
    private jumpPower: number = 10;
    @property
    private gravity: number = -5;
    @property
    private maxHeight: number = 3000;
    private velocity: Vec3 = new Vec3(0, 0, 0);
    private isJumping: boolean = false;
    private groundY: number = 0;
    private nowPower: number = 0;


    start() {
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.SPACE && !this.isJumping) {
                this.isJumping = true;
                this.nowPower = this.jumpPower;
            }
        }, this);
        // input.on(Input.EventType.KEY_UP, (event: EventKeyboard) => {
        //     if (event.keyCode === KeyCode.SPACE) {
        //         this.isJumping = false;
        //     }
        // }, this);
        this.groundY = this.node.position.y;
    }

    update(deltaTime: number) {
        if (this.isJumping) {
            this.velocity.y += this.nowPower * deltaTime;
            this.nowPower += this.gravity * deltaTime;
            // if (this.node.position.y >= this.maxHeight) {
            //     // this.isJumping = false;
            // }
            // console.log("now power", this.nowPower)
            // console.log("velocity:", this.velocity.y)
        }

        if (this.node.position.y < this.groundY) {
            this.node.setPosition(this.node.position.x, this.groundY);
            this.velocity.y = 0;
            this.nowPower = 0;
            this.isJumping = false;
        }

        this.node.setPosition(this.node.position.add(this.velocity));
    }
}