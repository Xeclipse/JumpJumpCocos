import { _decorator, Component, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { Character } from './Character';
import { DinoInputEvent, InputManager } from './InputManager';
import { DINO_EVENT_CHARACTER_DEAD, DINO_EVENT_FOOD_ATE, DINO_EVENT_FOOD_DESTROY, DINO_EVENT_INPUT_MANAGER } from '../DinoStringTable';
import { Food } from './Food';
import { DINO_DBUG_MODE, RandomUtil } from '../Utils';
const { ccclass, property } = _decorator;

const TOP_HEIGHT = 30;
const MID_HEIGHT = 0;
const BOTTOM_HEIGHT = -20;

// 跟随角色移动，食物生成在屏幕外
@ccclass('FoodSpawner')
export class FoodSpawner extends Component {
    @property({ type: Character })
    private character: Character = null!
    @property({ type: Prefab })
    private foodPref: Prefab = null!;
    @property({ type: InputManager })
    private inputManager: InputManager = null!;

    private initPos: Vec3 = null!;
    private genrateProb: number = 0.9;
    private isSpawning: boolean = false;
    private isInit: boolean = true;

    start() {
        this.isSpawning = false;
        setTimeout(() => {
            this.initPos = new Vec3(this.node.position.x + 500, this.node.position.y, this.node.position.z);
            this.schedule(() => {
                if (RandomUtil.checkProbability(this.genrateProb)) {
                    this.genrateFood();
                }
            }, 1, macro.REPEAT_FOREVER);
        }, 0.1);

        // for debug, P to spawn food
        if (DINO_DBUG_MODE) {
            this.inputManager.node.on(DINO_EVENT_INPUT_MANAGER, (eventID: DinoInputEvent) => {
                if (eventID == DinoInputEvent.INPUT_EVENT_DEBUG_GEN_FOOD) {
                    this.genrateFood();
                }
            }, this);
        }

    }

    update(deltaTime: number) {
        if (this.initPos != null) {
            this.node.setPosition(this.initPos.x + this.character.getDistance(), this.initPos.y, this.initPos.z);
        }
    }

    public setSpawn(isSpawningArg: boolean): void {
        this.isSpawning = isSpawningArg;
    }

    resetInit() {
        this.node.destroyAllChildren();
        if (this.initPos == null) {
            this.initPos = new Vec3();
        }
        this.initPos.set(this.node.position.x, this.node.position.y, this.node.position.z);
        this.isInit = true;
    }

    // 生成初始食物，在角色面前
    generateInitFoods(): void {
        for (let i = 0; i < 5; i++) {
            let foodNode: Node = this.genrateFood();
            if (foodNode == null) {
                continue;
            }
            let tmp = foodNode.position.clone()

            foodNode.position.set(tmp.x - 300 + foodNode?.getComponent(Food).getSpeed() * 20 * i, tmp.y, tmp.z);
        }
    }

    genrateFood(): Node | null {
        if (!this.isSpawning) {
            return null;
        }

        if (this.isInit) {
            this.isInit = false;
            this.generateInitFoods();
        }
        let foodNode = instantiate(this.foodPref);
        this.node.addChild(foodNode);

        let indx = Math.round(RandomUtil.getRandomNumber(0, 2));
        let height = MID_HEIGHT;
        if (indx == 0) {
            height = TOP_HEIGHT;
        }
        if (indx == 2) {
            height = BOTTOM_HEIGHT;
        }

        foodNode.setPosition(0, height, this.node.position.z);
        foodNode.on(DINO_EVENT_FOOD_DESTROY, (food: Food) => {
            setTimeout(() => {
                this.node.removeChild(food.node);
                food.node.destroy();
            }, 1);
        }, this);

        foodNode.on(DINO_EVENT_FOOD_ATE, (food: Food) => {
            this.character.eatFood(food);
            setTimeout(() => {
                this.node.removeChild(food.node);
                food.node.destroy();
            }, 1);
        }, this);

        return foodNode;
    }
}


