import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { RankingItem } from './RankingItem';
const { ccclass, property } = _decorator;

@ccclass('RankingList')
export class RankingList extends Component {
    @property({ type: Label })
    private loadingLabel: Label = null!;
    @property({ type: Prefab })
    private rankingItemPref: Prefab = null!;
    @property({ type: Node })
    private itemContainer: Node = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public startFetchData(): void {
        // clear list
        this.itemContainer.destroyAllChildren();
        // display loading label
        this.loadingLabel.node.active = true;
    }

    public fetchedData(data: any[]): void {
        /*
        [{
                "avatar_url": "",
                "nickname": "Spike",
                "score": "1000000",
            }] 
        */
        this.loadingLabel.node.active = false;
        data.forEach((rankingData) => {
            let rankingItem = instantiate(this.rankingItemPref);
            rankingItem.getComponent(RankingItem).setData(rankingData);
            this.itemContainer.addChild(rankingItem);
            console.log("???")
        });
    }
}


