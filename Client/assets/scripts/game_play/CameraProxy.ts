import { _decorator, Camera, Component, log, Vec3, Node, CCFloat } from 'cc';
import { Character } from './Character';
const { ccclass, property } = _decorator;


// 控制camera的行为
// 随着角色横向移动
@ccclass('CameraProxy')
export class CameraProxy extends Component {
    @property({ type: Camera })
    private mainCamera: Camera = null!;
    @property({ type: Character })
    private character: Character = null!;

    private initPos: Vec3 = null!;

    start() {
        setTimeout(() => {
            this.initPos = this.mainCamera.node.position;
        }, 0.1);
    }

    update(deltaTime: number) {
        if (this.initPos == null) {
            return;
        }

        this.mainCamera.node.setPosition(new Vec3(this.initPos.y + this.character.getDistance(), this.initPos.y, this.initPos.z));
    }
}


