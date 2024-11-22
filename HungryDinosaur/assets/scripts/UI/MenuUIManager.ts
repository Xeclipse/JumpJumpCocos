import { _decorator, Component, Node } from 'cc';
import { RankingManager } from '../game_play/RankingManager';
import { RankingList } from './RankingList';
const { ccclass, property } = _decorator;

export enum MenuUIEvents {
    QUERY_DISPLAY_RANKING = "QUERY_DISPLAY_RANKING",
    QUERY_QUIT_RANKING = 'QUERY_QUIT_RANKING',
}

@ccclass('MenuUIManager')
export class MenuUIManager extends Component {
    @property({ type: RankingManager })
    private rankingManager: RankingManager = null!;
    @property({ type: RankingList })
    private rankingListUI: RankingList = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public onClickRanking(): void {
        this.node.emit(MenuUIEvents.QUERY_DISPLAY_RANKING);
        this.rankingListUI.startFetchData();
        this.rankingManager.getRanking().then((rankingData: any) => {
            this.rankingListUI.fetchedData(rankingData);
        });
    }

    public onClickQuitRanking(): void {
        this.node.emit(MenuUIEvents.QUERY_QUIT_RANKING);
    }
}


