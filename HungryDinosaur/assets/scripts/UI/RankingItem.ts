import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankingItem')
export class RankingItem extends Component {
    @property({ type: Sprite })
    private avatar: Sprite = null!;
    @property({ type: Label })
    private nicknameLabel: Label = null!;
    @property({ type: Label })
    private scoreLabel: Label = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public setData(data: Record<string, string>): void {
        this.nicknameLabel.string = data["nickname"];
        this.scoreLabel.string = data["score"];
    }
}


