import { _decorator, BoxCollider2D, Prefab, Collider2D, Component, Contact2DType, director, EventKeyboard, ICollisionEvent, input, Input, IPhysics2DContact, Label, Node, Overflow, PhysicsSystem2D, RigidBody2D, Vec2, Vec3, CCInteger, Sprite, KeyCode, log } from 'cc';
import { Tags } from './GameManager';
import { DinoInputEvent, INPUT_MANAGER_EVENT, InputManager } from './InputManager';
import { DebugUIManager } from '../UI/DebugUIManager';
const { ccclass, property } = _decorator;

export enum CharacterState {
    IDLE = 0,
    RUNNING = 1,
    JUMPING,
    JUMP_EATING,
    FALLING,
    SLIDING,
    SLIDE_EATING,
    GETING_UP,
    DEAD,
}

// 记录角色状态，速度、饥饿值、当前动画等
@ccclass('Character')
export class Character extends Component {
    @property({ type: InputManager })
    private inputManager: InputManager = null!;
    @property({ type: DebugUIManager })
    private debugUIManager: DebugUIManager = null!;

    @property({ type: CCInteger })
    private playerSpeed: number = 1;

    @property({ type: Collider2D })
    private collider2d: Collider2D = null!;
    @property({ type: RigidBody2D })
    private rigidBody2D: RigidBody2D = null!;

    private impulse: number = 30;
    private state: CharacterState = null!;

    start() {
        this.collider2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        this.state = CharacterState.IDLE;
        this.inputManager.node.on(INPUT_MANAGER_EVENT, (event: DinoInputEvent) => { this.onKeyDown(event); });
    }

    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {

        if (otherCollider.tag == Tags.ENEMY) {
            this.debugUIManager.setPosLabel("begin colision enemy");
        }
        else {
            this.debugUIManager.setPosLabel("begin colision " + otherCollider.tag);
        }
    }

    onKeyDown(dinoInputEvent: DinoInputEvent) {
        switch (this.state) {
            case CharacterState.IDLE:
                // 挂机中，不接受任何输入
                break;
            case CharacterState.RUNNING:
                // 响应跳跃、滑铲、原地吃饭输入
                switch (dinoInputEvent) {
                    case DinoInputEvent.INPUT_EVENT_UP:
                        // 实现跳跃逻辑
                        this.rigidBody2D.applyLinearImpulseToCenter(new Vec2(0, this.impulse), true);
                        break;
                }

                break;
            case CharacterState.FALLING:
                break;
            default:
                break;
        }
    }

    update(deltaTime: number) {
        this.updatePhysics();
        this.updateSprite();
        this.updateState();
    }

    // 根据new state和current state，实现必要的逻辑
    // 只在updateState中调用
    // 永远不要直接对this.state赋值
    private changeState(newState: CharacterState): void {
        switch (this.state) {

        }
        this.state = newState;
    }

    // 根据state, 调整sprite，比如FALLING，则使用下坠的图片
    updateSprite(): void {

    }

    // 调整物理表现，调校手感
    updatePhysics(): void {

    }

    updateState(): void {
        switch (this.state) {
            case CharacterState.IDLE:
                this.changeState(CharacterState.RUNNING);
                break;
            case CharacterState.RUNNING:
                // 判断y方向的速度，大于0切换到跳跃
                if (this.rigidBody2D.linearVelocity.y > 0) {
                    this.changeState(CharacterState.JUMPING);
                }
                break;
            case CharacterState.JUMPING:
                // TODO: 实现跳吃东西的功能，应该在跳跃开始以后多少秒，切换到JUMP_EATING
                if (this.rigidBody2D.linearVelocity.y <= 0) {
                    this.changeState(CharacterState.FALLING);
                }
                break;
            case CharacterState.FALLING:
                if (this.rigidBody2D.linearVelocity.y == 0) {
                    this.changeState(CharacterState.RUNNING);
                }
                break;
        }
    }
}

