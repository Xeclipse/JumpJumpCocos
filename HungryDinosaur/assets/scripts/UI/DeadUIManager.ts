import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeadUIManager')
export class DeadUIManager extends Component {
    @property({ type: Label })
    private scoreLabel: Label = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    setScore(score: number): void {
        this.scoreLabel.string = "得分：" + score.toString();
    }
}


