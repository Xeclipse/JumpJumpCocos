import { _decorator, BoxCollider2D, Prefab, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, Vec2, Vec3, CCInteger, log, Sprite, Color } from 'cc';
import { DinoInputEvent, InputManager } from './InputManager';
import { DebugUIManager } from '../UI/DebugUIManager';
import { HUDManager } from '../UI/HUDManager';
import { DINO_EVENT_INPUT_MANAGER } from '../DinoStringTable';
import { DINO_DBUG_MODE } from '../Utils';
const { ccclass, property } = _decorator;

export enum CharacterState {
    IDLE = 0,
    RUNNING = 1,
    RUNNING_EAT,
    JUMPING,
    JUMP_EATING,
    FALLING,
    SLIDING,
    SLIDE_EATING,
    GETING_UP,
    DEAD,
}

const COLLIDER_TAG_BODY = 0;
const COLLIDER_TAG_GROUND_TOUCHER = 1;
const COLLIDER_TAG_EAT_ZONE = 2;
const COLLIDER_TAG_BOTTOM_EAT_ZONE = 3;

// 各类判定时长，单位：ms
const TIME_RUNNING_EAT = 100;
const TIME_JUMP_EAT = 100;
const TIME_SLIDE_EAT = 100;

// 记录角色状态，速度、饥饿值、当前动画等
@ccclass('Character')
export class Character extends Component {
    @property({ type: InputManager })
    private inputManager: InputManager = null!;
    @property({ type: DebugUIManager })
    private debugUIManager: DebugUIManager = null!;
    @property({ type: HUDManager })
    private hudManager: HUDManager = null!;

    @property({ type: CCInteger })
    private playerSpeed: number = 1;
    @property({ type: CCInteger })
    private jumpSpeed: number = 10;

    @property({ type: RigidBody2D })
    private characterRigidBody2D: RigidBody2D = null!;

    // for debug
    @property({ type: Sprite })
    private eatZoneSprite: Sprite = null!;
    @property({ type: Sprite })
    private bottomEatZoneSprite: Sprite = null!;

    private impulse: number = 30;
    private state: CharacterState = null!;
    private initPos: Vec3 = null!;
    private onGround: boolean = false;

    private eatZoneCollider: Collider2D = null!;
    private bottomEatZoneCollider: Collider2D = null!;

    start() {
        this.state = CharacterState.IDLE;

        // 延迟加载，避免用到的node未加载的情况
        setTimeout(() => {
            this.node.getComponents(Collider2D).forEach((collider: Collider2D) => {
                switch (collider.tag) {
                    case COLLIDER_TAG_BODY:
                        break;
                    case COLLIDER_TAG_GROUND_TOUCHER:
                        collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) => {
                            this.onGround = true;
                        }, this);
                        collider.on(Contact2DType.END_CONTACT, (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) => {
                            this.onGround = false;
                        }, this);
                        break;
                    case COLLIDER_TAG_EAT_ZONE:
                        this.eatZoneCollider = collider;
                        this.eatZoneCollider.enabled = false;
                        break;
                    case COLLIDER_TAG_BOTTOM_EAT_ZONE:
                        this.bottomEatZoneCollider = collider;
                        this.bottomEatZoneCollider.enabled = false;
                        break;
                }
            });

            this.inputManager.node.on(DINO_EVENT_INPUT_MANAGER, (event: DinoInputEvent) => { this.onKeyDown(event); });
            this.characterRigidBody2D.linearVelocity = new Vec2(this.playerSpeed, 0);
        }, 0.1);

    }

    startEating(collider: Collider2D, duration: number, debugSprite: Sprite) {
        if (collider != null) {
            if (DINO_DBUG_MODE) {
                debugSprite.color = new Color(0xFF, 0, 0);
            }
            collider.enabled = true;
            setTimeout(() => {
                collider.enabled = false
                if (DINO_DBUG_MODE) {
                    debugSprite.color = new Color(0x3A, 0x79, 0xFF);
                }
            }, duration);
        }
    }

    getDistance(): number {
        if (this.initPos == null) {
            return 0;
        }

        return this.characterRigidBody2D.node.worldPosition.x - this.initPos.x;
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
                        this.characterRigidBody2D.linearVelocity = new Vec2(this.playerSpeed, this.jumpSpeed);
                        break;
                    case DinoInputEvent.INPUT_EVENT_RIGHT:
                        // 跑吃逻辑，启用eat zone，定时禁用
                        this.startEating(this.eatZoneCollider, TIME_RUNNING_EAT, this.eatZoneSprite);
                        break;
                    case DinoInputEvent.INPUT_EVENT_DOWN:
                        this.startEating(this.bottomEatZoneCollider, TIME_SLIDE_EAT, this.bottomEatZoneSprite);
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
        this.updateUI();
        this.updatePhysics();
        this.updateSprite();
        this.updateState();
    }

    // 根据new state和current state，实现必要的逻辑
    // 只在updateState中调用
    // 永远不要直接对this.state赋值
    private changeState(newState: CharacterState): void {
        switch (this.state) {
            case CharacterState.JUMPING:
                if (newState == CharacterState.JUMP_EATING) {
                    this.startEating(this.eatZoneCollider, TIME_JUMP_EAT, this.eatZoneSprite);
                    break;
                }
                break;
        }
        this.state = newState;
    }

    updateUI(): void {
        this.hudManager.setDistance(this.getDistance());
    }

    // 根据state, 调整sprite，比如FALLING，则使用下坠的图片
    updateSprite(): void {

    }

    // 调整物理表现，调校手感
    updatePhysics(): void {
        switch (this.state) {
            case CharacterState.IDLE:
                this.initPos = new Vec3(this.characterRigidBody2D.node.worldPosition.x, this.characterRigidBody2D.node.worldPosition.y, this.characterRigidBody2D.node.worldPosition.z);
                break;
            case CharacterState.RUNNING:

                break;
            default:
                break;
        }
    }

    updateState(): void {
        switch (this.state) {
            case CharacterState.IDLE:
                this.changeState(CharacterState.RUNNING);
                break;
            case CharacterState.RUNNING:
                // 吃东西起作用，变到跑吃
                if (this.eatZoneCollider.enabled) {
                    this.changeState(CharacterState.RUNNING_EAT);
                    break;
                }

                // 判断y方向的速度，大于0切换到跳跃
                if (this.characterRigidBody2D.linearVelocity.y > 0.01) {
                    this.changeState(CharacterState.JUMPING);
                    break;
                }


                break;
            case CharacterState.RUNNING_EAT:
                if (!this.eatZoneCollider.enabled) {
                    this.changeState(CharacterState.RUNNING);
                    break;
                }
                break;
            case CharacterState.JUMPING:
                // 实现跳吃东西的功能，跳跃到最高点，切换到JUMP_EATING
                if (this.characterRigidBody2D.linearVelocity.y <= 0) {
                    this.changeState(CharacterState.JUMP_EATING);
                }
                break;
            case CharacterState.JUMP_EATING:
                // 结束吃逻辑时，进入FALLING
                if (this.eatZoneCollider.enabled == false) {
                    this.changeState(CharacterState.FALLING);
                }
                break;
            case CharacterState.FALLING:
                if (this.onGround) {
                    this.changeState(CharacterState.RUNNING);
                }
                break;
        }
    }
}

