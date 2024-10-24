import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HUDManager')
export class HUDManager extends Component {
    @property({ type: Label })
    private distanceLabel: Label = null!;

    @property({ type: Label })
    private scoreLabel: Label = null!;

    start() {

    }

    update(deltaTime: number) {

    }
}


