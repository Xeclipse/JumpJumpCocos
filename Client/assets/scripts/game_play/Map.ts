import { _decorator, BoxCollider2D, Collider2D, Component, instantiate, Label, Node, Prefab, RigidBody, RigidBody2D, Sprite, Vec2, Vec3 } from 'cc';
import { DebugUIManager } from '../UI/DebugUIManager';
import { Character } from './Character';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {
    @property({ type: DebugUIManager })
    debugUIManager: DebugUIManager = null!;

    @property(Node)
    private groundNode: Node = null!;

    @property(Character)
    private character: Character = null!;
    @property({ type: RigidBody2D })
    private deadZoneBody: RigidBody2D = null!;

    private groundNodeInitPos: Vec3 = null!;

    start() {
        setTimeout(() => {
            this.groundNodeInitPos = new Vec3(this.groundNode.position.x, this.groundNode.position.y, this.groundNode.position.z);
        }, 0.1);
    }

    update(deltaTime: number) {
        // 让地面跟着角色，让角色不会掉下去
        if (this.groundNodeInitPos != null) {
            this.groundNode.setPosition(this.groundNodeInitPos.x + this.character.getDistance(), this.groundNodeInitPos.y, this.groundNodeInitPos.z);
        }

        this.deadZoneBody.node.setPosition(this.character.node.position.x - 200, this.deadZoneBody.node.position.y, this.deadZoneBody.node.position.z);
    }
}