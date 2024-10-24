import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugUIManager')
export class DebugUIManager extends Component {
    @property({ type: Label })
    private posLabel: Label = null!;

    @property({ type: Label })
    private infoLabel: Label = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    setPosLabel(content: string): void {
        this.posLabel.string = content;
    }

    setInfoLabel(content: string): void {
        this.infoLabel.string = content;
    }
}


