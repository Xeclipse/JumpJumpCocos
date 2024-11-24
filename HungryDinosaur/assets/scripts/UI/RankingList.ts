import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from 'cc';
import { RankingItem } from './RankingItem';
import { DINO_KEY_ALL_PLAYER_DATA, DINO_KEY_CURRENT_PLAYER_DATA } from '../DinoStringTable';
import { RankingManager } from '../game_play/RankingManager';
const { ccclass, property } = _decorator;

@ccclass('RankingList')
export class RankingList extends Component {
    @property({ type: Label })
    private loadingLabel: Label = null!;
    @property({ type: Prefab })
    private rankingItemPref: Prefab = null!;
    @property({ type: Node })
    private itemContainer: Node = null!;
    @property({ type: RankingItem })
    private currentPlayerItem: RankingItem = null!;
    @property({ type: Button })
    private closeButton: Button = null!;
    @property({ type: RankingManager })
    private rankingManager: RankingManager = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public setCloseButtonVisibility(isVisible: boolean): void {
        this.closeButton.node.active = isVisible;
    }

    public startFetchData(): void {
        // clear list
        this.itemContainer.destroyAllChildren();
        this.currentPlayerItem.node.active = false;
        // display loading label
        this.loadingLabel.node.active = true;

        this.rankingManager.getRanking().then((rankingData: any) => {
            this.fetchedData(rankingData);
        });
    }

    private fetchedData(data: any[]): void {
        /*
        [{
                "avatar_url": "",
                "nickname": "Spike",
                "score": "1000000",
            }] 
        */
        this.loadingLabel.node.active = false;
        this.currentPlayerItem.node.active = true;
        let currentData = data[DINO_KEY_CURRENT_PLAYER_DATA];
        let allData = data[DINO_KEY_ALL_PLAYER_DATA];
        this.currentPlayerItem?.setData(currentData);
        allData.forEach((rankingData) => {
            let rankingItem = instantiate(this.rankingItemPref);
            rankingItem.getComponent(RankingItem).setData(rankingData);
            this.itemContainer.addChild(rankingItem);
        });
    }
}


