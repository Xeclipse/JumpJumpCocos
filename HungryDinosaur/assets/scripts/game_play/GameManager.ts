import { _decorator, Component, Game, Node } from 'cc';
import { Character } from './Character';
import { FoodSpawner } from './FoodSpawner';
import { CameraProxy } from './CameraProxy';
import { DinoMap } from './DinoMap';
import { HUDManager } from '../UI/HUDManager';
import { DeadUIManager } from '../UI/DeadUIManager';
import { MenuUIEvents, MenuUIManager } from '../UI/MenuUIManager';
const { ccclass, property } = _decorator;

export enum GameState {
    MAIN_MENU = 0,
    PLAYING = 1,
    DEAD,
    MAIN_RANKING,
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
    @property({ type: MenuUIManager })
    private menuUIManager: MenuUIManager = null!;

    @property({ type: Node })
    private mainMenu: Node = null;
    @property({ type: Node })
    private playUI: Node = null;
    @property({ type: Node })
    private hudUI: Node = null;
    @property({ type: Node })
    private mainRankingNode: Node = null!;


    private deadUINode: Node = null;

    private gameState: GameState = GameState.MAIN_MENU;
    private queryStart: boolean = false;
    private queryingRanking: boolean = false;

    private distance: number = 0;
    private score: number = 0;

    private allUINodes: Node[] = [];

    start() {
        this.gameState = GameState.MAIN_MENU;
        this.queryStart = false;
        this.deadUINode = this.deadUIManager?.node;
        this.menuUIManager?.node.on(MenuUIEvents.QUERY_DISPLAY_RANKING, () => {
            this.queryingRanking = true;
        });
        this.menuUIManager?.node.on(MenuUIEvents.RANKING_DATA_RECVED, (rankingData) => {
            console.log(rankingData);
        });
        this.menuUIManager?.node.on(MenuUIEvents.QUERY_QUIT_RANKING, () => {
            this.queryingRanking = false;
        });
        this.allUINodes.push(this.deadUINode);
        this.allUINodes.push(this.playUI);
        this.allUINodes.push(this.hudUI);
        this.allUINodes.push(this.mainRankingNode);
        this.allUINodes.push(this.mainMenu);
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

    private showUI(uiNodes: Node[]): void {
        this.allUINodes.forEach((uiNode: Node) => {
            if (uiNodes.indexOf(uiNode) < 0) {
                uiNode.active = false;
            } else {
                uiNode.active = true;
            }
        });
    }

    updateUI() {
        switch (this.gameState) {
            case GameState.MAIN_MENU:
                this.showUI([this.mainMenu]);
                break;
            case GameState.DEAD:
                this.showUI([this.deadUINode]);
                this.deadUIManager.setScore(this.score);
                break;
            case GameState.PLAYING:
                this.showUI([this.playUI, this.hudUI]);

                this.distance = this.character.getDistance();
                this.score = Math.round(this.character.getDistance() / 100);
                this.hudManager.updateDistance(this.distance);
                this.hudManager.updateScore(this.score);
                this.hudManager.updateHunger(this.character.getCurrentHunger(), this.character.getMaxHunger(), 1, 1);
                break;
            case GameState.MAIN_RANKING:
                this.showUI([this.mainRankingNode]);
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
            return;
        }

        if (this.gameState == GameState.MAIN_MENU) {
            if (this.queryingRanking) {
                this.changeState(GameState.MAIN_RANKING);
            }
        }

        if (this.gameState == GameState.MAIN_RANKING) {
            if (!this.queryingRanking) {
                this.changeState(GameState.MAIN_MENU);
            }
        }
    }

    onStartGame() {
        this.queryStart = true;
    }
}