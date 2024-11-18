import { _decorator, Component, Node } from 'cc';
import { RankingManager } from '../game_play/RankingManager';
const { ccclass, property } = _decorator;

export enum MenuUIEvents {
    QUERY_DISPLAY_RANKING = "QUERY_DISPLAY_RANKING",
    RANKING_DATA_RECVED = "RANKING_DATA_RECVED",
    QUERY_QUIT_RANKING = 'QUERY_QUIT_RANKING',
}

@ccclass('MenuUIManager')
export class MenuUIManager extends Component {
    @property({ type: RankingManager })
    private rankingManager: RankingManager = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public onClickRanking(): void {
        this.node.emit(MenuUIEvents.QUERY_DISPLAY_RANKING);
        this.rankingManager.getRanking().then((rankingData: any) => {
            this.node.emit(MenuUIEvents.RANKING_DATA_RECVED, rankingData);
        });
    }

    public onClickQuitRanking(): void {
        this.node.emit(MenuUIEvents.QUERY_QUIT_RANKING);
    }
}


