import { _decorator, Component, Node } from 'cc';
import { NetworkManager } from '../network/NetworkManager';
const { ccclass, property } = _decorator;

// 记录玩家状态：用户名、头像、最高记录等
@ccclass('DinoPlayer')
export class DinoPlayer extends Component {
    @property({ type: NetworkManager })
    private networkManager: NetworkManager = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public getAvatar(): string {
        if (this.networkManager.isDebugMode()) {
            return "";
        }
    }

    public getNickname(): string {
        if (this.networkManager.isDebugMode()) {
            return "debugger";
        }
    }
}


