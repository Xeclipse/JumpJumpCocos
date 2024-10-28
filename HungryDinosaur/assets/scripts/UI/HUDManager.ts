import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HUDManager')
export class HUDManager extends Component {
    @property({ type: Label })
    private distanceLabel: Label = null!;
    @property({ type: Label })
    private scoreLabel: Label = null!;
    @property({ type: ProgressBar })
    private hungerProgressBar: ProgressBar = null!;

    

    start() {
    }

    update(deltaTime: number) {

    }

    updateDistance(dist: number): void {
        this.distanceLabel.string = dist.toString();
    }

    updateScore(score:number):void{
        this.scoreLabel.string = score.toString();
    }

    updateHunger(current: number, total: number, thinThreshold: number, fatThreshold: number): void {
        if (current < 0) {
            current = 0;
        }
        this.hungerProgressBar.progress = current / total;
    }
}


