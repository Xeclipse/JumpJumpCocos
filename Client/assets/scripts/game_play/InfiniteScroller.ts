import { _decorator, log, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite, BoxCollider2D, RigidBody2D } from 'cc';
import { GROUP_DEADZONE } from '../PhysicsVars';
const { ccclass, property } = _decorator;


// 实现背景图无限滚动，替换sprite以实现云朵、背景装饰等逻辑
@ccclass('InfiniteScroller')
export class InfiniteScroller extends Component {
    @property({ type: Node })
    private leftNode: Node = null!;
    @property({ type: Node })
    private midNode: Node = null!;
    @property({ type: Node })
    private rightNode: Node = null!;

    private leftBackgroudnSprite: Sprite = null!;
    private midBackgroudnSprite: Sprite = null!;
    private rightBackgroudnSprite: Sprite = null!;

    private leftBackgroundCollider: BoxCollider2D = null!;
    private midBackgroundCollider: BoxCollider2D = null!;
    private rightBackgroundCollider: BoxCollider2D = null!;

    private leftRigidBody: RigidBody2D = null!;
    private midRigidBody: RigidBody2D = null!;
    private rightRigidBody: RigidBody2D = null!;


    private backgroundDist: number = 560;

    start() {
        setTimeout(() => {
            this.refreshComponents(this.leftNode, this.midNode, this.rightNode);

            let midPos = this.midNode.position;
            this.backgroundDist = this.midBackgroundCollider.size.x;
            this.leftNode.setPosition(midPos.x - this.backgroundDist, midPos.y, midPos.z);
            this.rightNode.setPosition(midPos.x + this.backgroundDist, midPos.y, midPos.z);

            this.leftBackgroundCollider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) => {
                if (otherCollider.group == GROUP_DEADZONE) {
                    this.onLeftHitDead();
                }
            }, this);
            this.midBackgroundCollider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
                if (otherCollider.group == GROUP_DEADZONE) {
                    this.onLeftHitDead();
                }
            }, this);
            this.rightBackgroundCollider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
                if (otherCollider.group == GROUP_DEADZONE) {
                    this.onLeftHitDead();
                }
            }, this);
        }, 1);
    }

    update(deltaTime: number) {

    }

    private onLeftHitDead(): void {
        setTimeout(() => {
            let rightPos = this.rightNode.position;
            this.leftNode.setPosition(rightPos.x + this.backgroundDist, rightPos.y, rightPos.z);
            this.reArrange(this.midNode, this.rightNode, this.leftNode);
        }, 1);
    }

    private refreshComponents(left: Node, mid: Node, right: Node): void {
        this.leftBackgroudnSprite = this.leftNode?.getComponent(Sprite);
        this.midBackgroudnSprite = this.midNode?.getComponent(Sprite);
        this.rightBackgroudnSprite = this.rightNode?.getComponent(Sprite);

        this.leftBackgroundCollider = this.leftNode?.getComponent(BoxCollider2D);
        this.midBackgroundCollider = this.midNode?.getComponent(BoxCollider2D);
        this.rightBackgroundCollider = this.rightNode?.getComponent(BoxCollider2D);

        this.leftRigidBody = this.leftNode?.getComponent(RigidBody2D);
        this.midRigidBody = this.midNode?.getComponent(RigidBody2D);
        this.rightRigidBody = this.rightNode?.getComponent(RigidBody2D);
    }

    private reArrange(left: Node, mid: Node, right: Node): void {
        this.refreshComponents(left, mid, right);
        this.leftNode = left;
        this.midNode = mid;
        this.rightNode = right;
    }
}


