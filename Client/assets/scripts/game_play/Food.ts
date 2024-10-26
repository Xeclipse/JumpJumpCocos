import { _decorator, CCInteger, Collider2D, Component, Contact2DType, log, RigidBody2D, Vec2, BoxCollider2D, IPhysics2DContact } from 'cc';
import { DINO_EVENT_FOOD_ATE } from '../DinoStringTable';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {
    @property({ type: RigidBody2D })
    private rigidBody: RigidBody2D = null!;
    @property({ type: Collider2D })
    private collider: Collider2D = null!;

    @property({ type: CCInteger })
    private foodSpeed: number = 0;

    start() {
        setTimeout(() => {
            this.rigidBody.linearVelocity = new Vec2(-this.foodSpeed, 0);
        }, 0.1);

        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) => {
            this.node.emit(DINO_EVENT_FOOD_ATE, this);
        }, this);
    }

    update(deltaTime: number) {

    }
}


