import { _decorator, BoxCollider2D, log, Component, Contact2DType, ImageAsset, instantiate, IPhysics2DContact, Label, Node, Prefab, RigidBody, RigidBody2D, Sprite, SpriteFrame, Vec2, Vec3 } from 'cc';
import { DebugUIManager } from '../UI/DebugUIManager';
import { Character } from './Character';
import { GROUP_DEADZONE } from '../PhysicsVars';
const { ccclass, property } = _decorator;

@ccclass('DinoMap')
export class DinoMap extends Component {
    @property({ type: DebugUIManager })
    debugUIManager: DebugUIManager = null!;

    @property(Node)
    private groundNode: Node = null!;

    @property(Character)
    private character: Character = null!;
    @property({ type: RigidBody2D })
    private deadZoneBody: RigidBody2D = null!;

    private groundNodeInitPos: Vec3 = null!;
    private deadZoneDist: number = 0;

    start() {
        
    }

    update(deltaTime: number) {
        // 让地面跟着角色，让角色不会掉下去
        if (this.groundNodeInitPos != null) {
            this.groundNode.setPosition(this.groundNodeInitPos.x + this.character.getDistance(), this.groundNodeInitPos.y, this.groundNodeInitPos.z);

            this.deadZoneBody.node.setPosition(this.character.node.position.x - this.deadZoneDist, this.deadZoneBody.node.position.y, this.deadZoneBody.node.position.z);
        }
    }

    public initArgs(): void {
        setTimeout(() => {
            this.groundNodeInitPos = new Vec3(this.groundNode.position.x, this.groundNode.position.y, this.groundNode.position.z);
            this.deadZoneDist = this.character.node.position.x - this.deadZoneBody.node.position.x;
        }, 1);
    }
}