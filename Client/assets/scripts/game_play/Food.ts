import { _decorator, CCInteger, Collider2D, Component, Contact2DType, log, RigidBody2D, Vec2, BoxCollider2D, IPhysics2DContact } from 'cc';
import { DINO_EVENT_FOOD_ATE, DINO_EVENT_FOOD_DESTROY } from '../DinoStringTable';
import { GROUP_EAT_ZONE } from '../PhysicsVars';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {
    @property({ type: RigidBody2D })
    private rigidBody: RigidBody2D = null!;
    @property({ type: Collider2D })
    private collider: Collider2D = null!;

    @property({ type: CCInteger })
    private foodSpeed: number = 0;
    @property({ type: CCInteger })
    private foodHunger: number = 3;
    @property({ type: CCInteger })
    private foodHungerPrecise: number = 10;

    start() {
        setTimeout(() => {
            this.rigidBody.linearVelocity = new Vec2(-this.foodSpeed, 0);
        }, 0.1);

        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) => {
            if (otherCollider.group == GROUP_EAT_ZONE) {
                this.node.emit(DINO_EVENT_FOOD_ATE, this);
            } else {
                this.node.emit(DINO_EVENT_FOOD_DESTROY, this);
            }
        }, this);
    }

    update(deltaTime: number) {

    }

    public getHunger(isPrecise: boolean): number {
        return isPrecise ? this.foodHungerPrecise : this.foodHunger;
    }
}


