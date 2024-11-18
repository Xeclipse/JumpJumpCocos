import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    @property({ type: Boolean })
    private isDebug: boolean = true;

    start() {

    }

    update(deltaTime: number) {

    }

    public isDebugMode(): boolean {
        return this.isDebug;
    }
}


