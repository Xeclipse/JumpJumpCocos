import { _decorator, BoxCollider2D, Prefab, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, Vec2, Vec3, CCInteger, log, Sprite, Color, Animation, UITransform, Size } from 'cc';
import { DinoInputEvent, InputManager } from './InputManager';
import { DebugUIManager } from '../UI/DebugUIManager';
import { HUDManager } from '../UI/HUDManager';
import { DINO_EVENT_CHARACTER_DEAD, DINO_EVENT_INPUT_MANAGER } from '../DinoStringTable';
import { DINO_DBUG_MODE } from '../Utils';
import { Food } from './Food';
import { AudioManager, DinoSFX } from './AudioManager';
const { ccclass, property } = _decorator;

export enum CharacterState {
    IDLE = 0,
    RUNNING = 1,
    RUN_EATING,
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

const ANIM_NAME_STAND = 'debug_anim_stand'
const ANIM_NAME_RUNNING = 'debug_anim_running'
const ANIM_NAME_JUMPING = 'debug_anim_jumping'
const ANIM_NAME_SLIDING = 'debug_anim_slide'
const ANIM_NAME_DEAD = 'debug_anim_dead'
const ANIM_NAME_FALLING = 'debug_anim_falling'

// 记录角色状态，速度、饥饿值、当前动画等
@ccclass('Character')
export class Character extends Component {
    @property({ type: InputManager })
    private inputManager: InputManager = null!;
    @property({ type: DebugUIManager })
    private debugUIManager: DebugUIManager = null!;
    @property({ type: AudioManager })
    private audioManager: AudioManager = null!;

    @property({ type: CCInteger })
    private playerSpeed: number = 1;
    @property({ type: CCInteger })
    private jumpSpeed: number = 10;

    @property({ type: RigidBody2D })
    private characterRigidBody2D: RigidBody2D = null!;
    @property({type:Sprite})
    private body:Sprite =null;

    @property({ type: CCInteger })
    private characterHungerMax: number = 100;
    @property({ type: CCInteger })
    private characterHungerCost: number = 5;
    @property({ type: CCInteger })
    private characterHungerInit: number = 100;

    // for debug
    @property({ type: Sprite })
    private eatZoneSprite: Sprite = null!;
    @property({ type: Sprite })
    private bottomEatZoneSprite: Sprite = null!;

    private impulse: number = 30;
    private deltaCounter: number = 0;
    private state: CharacterState = null!;
    private initPos: Vec3 = null!;
    private currentHunger: number = 0;
    private onGround: boolean = false;
    private isPrecise: boolean = false;


    private sizeScale: number = 1.0;
    private maxContentWidth: number = 40;

    private eatZoneCollider: Collider2D = null!;
    private bottomEatZoneCollider: Collider2D = null!;


    // 各类判定时长，单位：ms
    private TIME_RUNNING_EAT = 100;
    private TIME_RUNNING_PRECISE_EAT = 50;
    private TIME_JUMP_EAT = 100;
    private TIME_JUMP_PRECISE_EAT = 50;
    private TIME_SLIDE_EAT = 100;
    private TIME_SLIDE_PRECISE_EAT = 50;

    private characterAnim: Animation = null!;
    private isPlaying: boolean = false;

    initArgs() {
        this.initPos = new Vec3(this.characterRigidBody2D.node.position.x, this.characterRigidBody2D.node.position.y, this.characterRigidBody2D.node.position.z);
        this.currentHunger = this.characterHungerInit;
        this.deltaCounter = 0;
    }

    public getCurrentHunger(): number {
        return this.currentHunger;
    }

    public getMaxHunger(): number {
        return this.characterHungerMax;
    }

    start() {
        this.state = CharacterState.IDLE;
        this.isPlaying = false;
        this.initArgs();

        this.characterAnim = this.node.getComponent(Animation);

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

            this.inputManager.node.on(DINO_EVENT_INPUT_MANAGER, (event: DinoInputEvent) => {
                this.onKeyDown(event);
            });
        }, 0.1);

    }

    startEating(collider: Collider2D, duration: number, preciseDuration: number, debugSprite: Sprite) {
        // FF0000 for eat
        // 00FF00 for precise eat
        // 3A79FF for normal
        if (collider != null) {
            if (DINO_DBUG_MODE) {
                debugSprite.color = new Color(0xFF, 0, 0);
            }
            collider.enabled = true;

            setTimeout(() => {
                this.isPrecise = true;
                if (DINO_DBUG_MODE) {
                    debugSprite.color = new Color(0x00, 0xFF, 0x00);
                }
                setTimeout(() => {
                    collider.enabled = false;
                    if (DINO_DBUG_MODE) {
                        debugSprite.color = new Color(0x3A, 0x79, 0xFF);
                    }
                }, preciseDuration);
            }, duration - preciseDuration);


        }
    }

    getDistance(): number {
        if (this.initPos == null) {
            return 0;
        }

        return this.characterRigidBody2D.node.position.x - this.initPos.x;
    }

    onKeyDown(dinoInputEvent: DinoInputEvent) {
        switch (this.state) {
            case CharacterState.IDLE:
                // 挂机中，不接受任何输入
                break;
            case CharacterState.RUNNING:
                // 响应跳跃、滑铲、原地吃饭输入
                if (dinoInputEvent == DinoInputEvent.INPUT_EVENT_UP) {
                    // 实现跳跃逻辑
                    this.characterRigidBody2D.linearVelocity = new Vec2(this.playerSpeed, this.jumpSpeed);
                    //this.characterRigidBody2D.applyLinearImpulseToCenter(new Vec2(0,this.impulse),true);
                } else if (dinoInputEvent == DinoInputEvent.INPUT_EVENT_RIGHT) {
                    // 跑吃逻辑，启用eat zone，定时禁用
                    this.startEating(this.eatZoneCollider, this.TIME_RUNNING_EAT, this.TIME_RUNNING_PRECISE_EAT, this.eatZoneSprite);
                } else if (dinoInputEvent == DinoInputEvent.INPUT_EVENT_DOWN) {
                    this.startEating(this.bottomEatZoneCollider, this.TIME_SLIDE_EAT, this.TIME_SLIDE_PRECISE_EAT, this.bottomEatZoneSprite);
                }
                break;
            case CharacterState.FALLING:
                break;
            default:
                break;
        }
    }

    update(deltaTime: number) {
        this.updateCharacterProperties(deltaTime);
        this.updateAnim();
        this.updateState();
        
    }

    // 根据new state和current state，实现必要的逻辑
    // 只在updateState中调用
    // 永远不要直接对this.state赋值
    private changeState(newState: CharacterState): void {
        if (this.state == newState) {
            return;
        }
        // 死亡逻辑，优先级高
        if (newState == CharacterState.DEAD) {
            this.state = newState;
            this.characterRigidBody2D.linearVelocity = new Vec2(0, 0);
            this.node.emit(DINO_EVENT_CHARACTER_DEAD);
            return;
        }

        if (this.state == CharacterState.RUN_EATING ||
            this.state == CharacterState.JUMP_EATING ||
            this.state == CharacterState.SLIDE_EATING
        ) {
            this.isPrecise = false;
        }

        if (newState == CharacterState.IDLE) {
            this.initArgs();
            this.node.setPosition(this.initPos.x, this.initPos.y + 20, this.initPos.z);
        }

        switch (this.state) {
            case CharacterState.JUMPING:
                if (newState == CharacterState.JUMP_EATING) {
                    this.startEating(this.eatZoneCollider, this.TIME_JUMP_EAT, this.TIME_JUMP_PRECISE_EAT, this.eatZoneSprite);
                    break;
                }
                break;
            case CharacterState.IDLE:
                if (newState == CharacterState.RUNNING) {
                    this.characterRigidBody2D.linearVelocity = new Vec2(this.playerSpeed, 0);
                    break;
                }
                break;
        }

        // play sounds
        switch (newState) {
            case CharacterState.JUMPING:
                this.audioManager.playSFX(DinoSFX.JUMP);
                break;
            case CharacterState.RUN_EATING:
                this.audioManager.playSFX(DinoSFX.RUN_EAT);
                break;
            case CharacterState.SLIDE_EATING:
                this.audioManager.playSFX(DinoSFX.SLIDE);
                break;
        }

        this.state = newState;
    }

    updateCharacterProperties(delta: number) {
        if (this.state == CharacterState.IDLE || this.state == CharacterState.DEAD) {
            return;
        }
        this.deltaCounter += delta;
        if (this.deltaCounter > 1) {
            this.deltaCounter -= 1;
            this.currentHunger -= this.characterHungerCost;
        }
        // 更新尺寸大小
        this.sizeScale = 0.25+(this.getCurrentHunger()/this.getMaxHunger())*0.75;
        let nowSize = this.node.getComponent(UITransform).contentSize;
        this.body.getComponent(UITransform).contentSize = new Size(this.maxContentWidth*this.sizeScale,nowSize.y);
        
    }

    

    private changeToAnim(animName: string) {
        if (!this.characterAnim.getState(animName).isPlaying) {
            this.characterAnim.stop();
            this.characterAnim.play(animName);
        }
    }

    // 根据state, 调整sprite，比如FALLING，则使用下坠的图片
    updateAnim(): void {
        if (this.characterAnim == null) {
            return;
        }

        switch (this.state) {
            case CharacterState.DEAD:
                this.changeToAnim(ANIM_NAME_DEAD);
                break;
            case CharacterState.FALLING:
                this.changeToAnim(ANIM_NAME_FALLING);
                break;
            case CharacterState.JUMPING:
                this.changeToAnim(ANIM_NAME_JUMPING);
                break;
            case CharacterState.RUNNING:
                this.changeToAnim(ANIM_NAME_RUNNING);
                break;
            case CharacterState.SLIDE_EATING:
                this.changeToAnim(ANIM_NAME_SLIDING);
                break;
            case CharacterState.IDLE:
                this.changeToAnim(ANIM_NAME_STAND);
                break;
        }
    }

    updateState(): void {
        switch (this.state) {
            case CharacterState.IDLE:
                if (this.isPlaying) {
                    this.changeState(CharacterState.RUNNING);
                }
                break;
            case CharacterState.RUNNING:
                // 吃东西起作用，变到跑吃
                if (this.eatZoneCollider.enabled) {
                    this.changeState(CharacterState.RUN_EATING);
                    break;
                }

                // 判断y方向的速度，大于0切换到跳跃
                if (this.characterRigidBody2D.linearVelocity.y > 0.01) {
                    this.changeState(CharacterState.JUMPING);
                    break;
                }

                if (this.bottomEatZoneCollider.enabled) {
                    this.changeState(CharacterState.SLIDE_EATING);
                    break;
                }
                break;
            case CharacterState.SLIDE_EATING:
                if (!this.bottomEatZoneCollider.enabled) {
                    this.changeState(CharacterState.RUNNING);
                    break;
                }
                break;
            case CharacterState.RUN_EATING:
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

        // 在非进食状态下，hunger <= 0，则死亡
        if (this.state != CharacterState.JUMP_EATING &&
            this.state != CharacterState.RUN_EATING &&
            this.state != CharacterState.SLIDE_EATING &&
            this.currentHunger <= 0) {
            this.changeState(CharacterState.DEAD);
        }
    }

    public eatFood(food: Food): void {
        this.currentHunger += food.getHunger(this.isPrecise);
    }

    public isDead(): boolean {
        return this.state == CharacterState.DEAD;
    }

    public startPlay(): void {
        this.isPlaying = true;
        this.changeState(CharacterState.IDLE);
    }
}

