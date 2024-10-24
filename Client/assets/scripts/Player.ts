import { _decorator, BoxCollider2D, Prefab, Collider2D, Component, Contact2DType, director, EventKeyboard, ICollisionEvent, input, Input, IPhysics2DContact, Label, Node, Overflow, PhysicsSystem2D, RigidBody2D, Vec2, Vec3 } from 'cc';
import { Tags } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    // @property(RigidBody2D)
    // rigidBody: RigidBody2D | null = null;

    // @property(BoxCollider2D)
    // colliderBody: BoxCollider2D | null = null;

    @property(Label)
    posLabel: Label | null = null;

    @property
    private impulse: number = 30;

    @property
    private playrSpeed: number = 1;

    // private updateTime: number = 0;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        let collider2d = this.node.getComponent(Collider2D)
        collider2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // collider2d.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // let colliderBody = this.node.getComponent(BoxCollider2D);
        // let rigidBody = this.node.getComponent(RigidBody2D);
    }

    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == Tags.enemy) {
            this.posLabel.string = "begin colision enemy"
        }
        else {
            this.posLabel.string = "begin colision " + otherCollider.tag
        }

    }

    // onEndContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
    //     this.posLabel.string="end colision!"
    // }
    // onPreSolve (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
    //     this.posLabel.string="preSolve!"
    // }
    // onPostSolve (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null){
    //     this.posLabel.string="postSolve!"
    // }

    onKeyDown(event: EventKeyboard) {
        this.node.getComponent(RigidBody2D).applyLinearImpulseToCenter(new Vec2(0, this.impulse), true);
    }
    onKeyUp(event: EventKeyboard) {
    }

    update(deltaTime: number) {
        // this.posLabel.string = this.rigidBody.node.position.toString();
        // this.posLabel.string = this.updateTime.toString();
        // this.updateTime+=1;
        // if (this.rigidBody.node.position.y < this.groundY) {
        //     this.rigidBody.gravityScale = 0;
        //     this.rigidBody.linearVelocity.set(0,0);
        //     // this.rigidBody.applyForceToCenter(new Vec2(0,-PhysicsSystem2D.instance.gravity.y),true);
        //     this.rigidBody.node.setPosition(this.node.position.x, this.groundY);
        //     // console.log("set position ")
        // }
        // else if(this.rigidBody.node.position.y > this.groundY){
        //     this.rigidBody.gravityScale = 1;
        // }
    }
}

