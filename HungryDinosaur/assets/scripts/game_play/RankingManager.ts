import { _decorator, Component, Node } from 'cc';
import { NetworkManager } from '../network/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('RankingManager')
export class RankingManager extends Component {
    @property({ type: NetworkManager })
    private networkManager: NetworkManager = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    async getRanking(): Promise<any> {
        try {
            const data = await this.loadRanking();
            return data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    private loadRanking(): any {
        if (this.networkManager == null) {
            return null;
        }
        if (this.networkManager.isDebugMode()) {
            // mock data
            return [{
                "avatar_url": "",
                "nickname": "Spike",
                "score": "1000000",
            }]
        }
    }
}


