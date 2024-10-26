import { _decorator, CCInteger, Component, Node, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {
    @property({ type: RigidBody2D })
    private rigidBody: RigidBody2D = null!;

    @property({ type: CCInteger })
    private foodSpeed: number = 0;

    start() {
        setTimeout(() => {
            this.rigidBody.linearVelocity = new Vec2(-this.foodSpeed, 0);
        }, 0.1);
    }

    update(deltaTime: number) {

    }
}


