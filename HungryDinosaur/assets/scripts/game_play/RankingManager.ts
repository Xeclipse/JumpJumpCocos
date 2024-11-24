import { _decorator, Component, Node } from 'cc';
import { NetworkManager } from '../network/NetworkManager';
import { DINO_KEY_ALL_PLAYER_DATA, DINO_KEY_AVATAR_URL, DINO_KEY_CURRENT_PLAYER_AVATAR_URL, DINO_KEY_CURRENT_PLAYER_DATA, DINO_KEY_CURRENT_PLAYER_HIGHSCORE, DINO_KEY_CURRENT_PLAYER_NICKNAME, DINO_KEY_NICKNAME, DINO_KEY_SCORE } from '../DinoStringTable';
const { ccclass, property } = _decorator;

@ccclass('RankingManager')
export class RankingManager extends Component {
    @property({ type: NetworkManager })
    private networkManager: NetworkManager = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public async uploadRanking(avatar: string, nickname: string, score: string): Promise<any> {
        if (this.networkManager.isDebugMode()) {
            await fetch("https://www.baidu.com", { method: "GET", mode: "no-cors" }).then((res) => {
                console.log('debug response:');
                console.log(res);
            });
            localStorage.setItem(DINO_KEY_CURRENT_PLAYER_AVATAR_URL, avatar);
            localStorage.setItem(DINO_KEY_CURRENT_PLAYER_NICKNAME, nickname);
            localStorage.setItem(DINO_KEY_CURRENT_PLAYER_HIGHSCORE, score);
        } else {

        }
    }

    public async getRanking(): Promise<any> {
        try {
            const data = await this.loadRanking();
            return data;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    private async loadRanking(): Promise<any> {
        if (this.networkManager == null) {
            return null;
        }

        if (this.networkManager.isDebugMode()) {
            // mock data
            await fetch("https://www.baidu.com", { method: "GET", mode: "no-cors" }).then((res) => {
                console.log('debug response:');
                console.log(res);
            });
            let currentPlayerData = {
                [DINO_KEY_AVATAR_URL]: "",
                [DINO_KEY_NICKNAME]: "无数据",
                [DINO_KEY_SCORE]: "无数据",
            }
            try {
                let curAvatar = localStorage.getItem(DINO_KEY_CURRENT_PLAYER_AVATAR_URL);
                let curNickname = localStorage.getItem(DINO_KEY_CURRENT_PLAYER_NICKNAME);
                let curHighscore = localStorage.getItem(DINO_KEY_CURRENT_PLAYER_HIGHSCORE);
                curAvatar = curAvatar == null ? "" : curAvatar;
                curNickname = curNickname == null ? "无数据" : curNickname;
                curHighscore = curHighscore == null ? "无数据" : curHighscore;
                currentPlayerData = {
                    [DINO_KEY_AVATAR_URL]: curAvatar,
                    [DINO_KEY_NICKNAME]: curNickname,
                    [DINO_KEY_SCORE]: curHighscore,

                }
            } catch (error) { }

            return {
                [DINO_KEY_CURRENT_PLAYER_DATA]:
                    currentPlayerData,
                [DINO_KEY_ALL_PLAYER_DATA]:
                    [{
                        [DINO_KEY_AVATAR_URL]: "",
                        [DINO_KEY_NICKNAME]: "S.S.S.S.",
                        [DINO_KEY_SCORE]: "100",
                    }, {
                        [DINO_KEY_AVATAR_URL]: "",
                        [DINO_KEY_NICKNAME]: "Spike",
                        [DINO_KEY_SCORE]: "1000000",
                    }]
            }
        }

    }
}


