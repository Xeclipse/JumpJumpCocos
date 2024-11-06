import { _decorator, AudioSource, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum DinoSFX {
    JUMP = 0,
    RUN_EAT = 1,
    SLIDE,
}

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property({ type: AudioSource })
    private sfxJump: AudioSource = null!;
    @property({ type: AudioSource })
    private sfxRunEat: AudioSource = null!;
    @property({ type: AudioSource })
    private sfxSlide: AudioSource = null!;

    start() {

    }

    update(deltaTime: number) {

    }

    public playSFX(dinoSFX: DinoSFX): void {
        switch (dinoSFX) {
            case DinoSFX.JUMP:
                this.sfxJump?.play();
                break;
            case DinoSFX.RUN_EAT:
                this.sfxRunEat?.play();
                break;
            case DinoSFX.SLIDE:
                this.sfxSlide?.play();
                break;
        }
    }
}


