import { _decorator, Component, instantiate, macro, log, Prefab, Vec3 } from 'cc';
import { Character } from './Character';
import { DinoInputEvent, InputManager } from './InputManager';
import { DINO_EVENT_FOOD_ATE, DINO_EVENT_INPUT_MANAGER } from '../DinoStringTable';
import { Food } from './Food';
import { ProbabilityUtil } from '../Utils';
const { ccclass, property } = _decorator;

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

    start() {
        setTimeout(() => {
            this.initPos = new Vec3(this.node.position.x, this.node.position.y, this.node.position.z);
            this.schedule(() => {
                if (ProbabilityUtil.checkProbability(this.genrateProb)) {
                    this.genrateFood();
                }
            }, 1, macro.REPEAT_FOREVER);
        }, 0.1);

        // for debug
        this.inputManager.node.on(DINO_EVENT_INPUT_MANAGER, (eventID: DinoInputEvent) => {
            if (eventID == DinoInputEvent.INPUT_EVENT_DEBUG_GEN_FOOD) {
                this.genrateFood();
            }
        }, this);

    }

    update(deltaTime: number) {
        if (this.initPos != null) {
            this.node.setPosition(this.initPos.x + this.character.getDistance(), this.initPos.y, this.initPos.z);
        }
    }

    genrateFood(): void {
        let foodNode = instantiate(this.foodPref);
        this.node.addChild(foodNode);
        foodNode.setPosition(0, 0, this.node.position.z);
        foodNode.on(DINO_EVENT_FOOD_ATE, (food: Food) => {
            setTimeout(() => {
                this.node.removeChild(food.node);
                food.node.destroy();
            }, 0.1);
        }, this);
    }
}


