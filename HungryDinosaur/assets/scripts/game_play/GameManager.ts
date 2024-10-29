import { _decorator, Component, Node } from 'cc';
import { Character } from './Character';
import { FoodSpawner } from './FoodSpawner';
import { CameraProxy } from './CameraProxy';
import { DinoMap } from './DinoMap';
import { HUDManager } from '../UI/HUDManager';
import { DeadUIManager } from '../UI/DeadUIManager';
const { ccclass, property } = _decorator;

export enum GameState {
    MAIN_MENU = 0,
    PLAYING = 1,
    DEAD,
}

// 管理整体，永远不要让其它component引用
@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Character })
    private character: Character = null!;
    @property({ type: FoodSpawner })
    private foodSpawner: FoodSpawner = null!;
    @property({ type: CameraProxy })
    private cemaraProxy: CameraProxy = null!;
    @property({ type: DinoMap })
    private dinoMap: DinoMap = null!;
    @property({ type: HUDManager })
    private hudManager: HUDManager = null!;
    @property({ type: DeadUIManager })
    private deadUIManager: DeadUIManager = null!;

    @property({ type: Node })
    private mainMenu: Node = null;
    @property({ type: Node })
    private playUI: Node = null;
    @property({ type: Node })
    private hudUI: Node = null;


    private deadUINode: Node = null;

    private gameState: GameState = GameState.MAIN_MENU;
    private queryStart: boolean = false;

    private distance: number = 0;
    private score: number = 0;

    start() {
        this.gameState = GameState.MAIN_MENU;
        this.queryStart = false;
        this.deadUINode = this.deadUIManager?.node;
    }

    update(deltaTime: number) {
        this.updateUI();
        this.updateState();
    }

    changeState(newState: GameState) {
        if (this.gameState == newState) {
            return;
        }
        if (newState == GameState.PLAYING) {
            this.cemaraProxy.resetPos();
            this.dinoMap.initArgs();
            this.character.startPlay();
            this.foodSpawner.resetInit();
            this.foodSpawner.setSpawn(true);
        }

        if (newState == GameState.DEAD) {
            this.foodSpawner.setSpawn(false);
        }

        this.gameState = newState;
    }

    updateUI() {
        switch (this.gameState) {
            case GameState.MAIN_MENU:
                this.playUI.active = false;
                this.hudUI.active = false;
                this.deadUINode.active = false;
                this.mainMenu.active = true;
                break;
            case GameState.DEAD:
                this.playUI.active = false;
                this.hudUI.active = false;
                this.deadUINode.active = true;
                this.mainMenu.active = false;
                this.deadUIManager.setScore(this.score);
                break;
            case GameState.PLAYING:
                this.playUI.active = true;
                this.hudUI.active = true;
                this.deadUINode.active = false;
                this.mainMenu.active = false;

                this.distance = this.character.getDistance();
                this.score = Math.round(this.character.getDistance() / 100);
                this.hudManager.updateDistance(this.distance);
                this.hudManager.updateScore(this.score);
                this.hudManager.updateHunger(this.character.getCurrentHunger(), this.character.getMaxHunger(), 1, 1);
                break;
        }
    }

    updateState() {
        if ((this.gameState == GameState.MAIN_MENU || this.gameState == GameState.DEAD)
            && this.queryStart) {
            this.queryStart = false;
            this.changeState(GameState.PLAYING);
            return
        }

        if (this.gameState == GameState.PLAYING && this.character.isDead()) {
            this.changeState(GameState.DEAD);
        }
    }

    onStartGame() {

        this.queryStart = true;
    }
}