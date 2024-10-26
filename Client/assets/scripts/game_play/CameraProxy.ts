import { _decorator, Camera, Component, log, Vec3, Node, CCFloat } from 'cc';
import { Character } from './Character';
import { DINO_DBUG_MODE } from '../Utils';
const { ccclass, property } = _decorator;

const CAMERA_LAYER_DEBUG = 1;
const CAMERA_LAYER_DINO_HUD = 1 << 1;
const CAMERA_LAYER_DINO_GAME_PLAY = 1 << 2;
const CAMERA_LAYER_DINO_INVISIBLE = 1 << 3;

// 控制camera的行为
// camera随着角色横向移动
// 设置cameraHeight来控制视野大小
// 调整initPos移动初始位置
@ccclass('CameraProxy')
export class CameraProxy extends Component {
    @property({ type: Camera })
    private mainCamera: Camera = null!;
    @property({ type: Character })
    private character: Character = null!;
    @property({ type: CCFloat })
    private cameraHeight: number = 200;

    private initPos: Vec3 = null!;

    start() {
        // 移除IVISIBLE图层
        if (!DINO_DBUG_MODE) {
            this.mainCamera.visibility &= ~CAMERA_LAYER_DINO_INVISIBLE;
        }

        setTimeout(() => {
            this.initPos = new Vec3(this.mainCamera.node.position.x + 250, this.mainCamera.node.position.y, this.mainCamera.node.position.z);
            this.mainCamera.orthoHeight = this.cameraHeight;
        }, 1);
    }

    update(deltaTime: number) {
        if (this.initPos == null) {
            return;
        }

        this.mainCamera.node.setPosition(this.initPos.x + this.character.getDistance(), this.initPos.y, this.initPos.z);
    }
}


