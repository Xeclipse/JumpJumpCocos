import { _decorator, BoxCollider2D, Collider2D, Component, instantiate, Label, Node, Prefab, RigidBody, RigidBody2D, Sprite, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Map')
export class Map extends Component {

    @property(Sprite)
    ground: Sprite | null = null;

    @property(Prefab)
    cube: Prefab | null = null;

    @property(Prefab)
    highCube: Prefab | null = null;

    @property(Label)
    infoLabel: Label | null = null;

    private _obstacles: Node[] = []
    private _groundLeftBoundary: number = 0;
    private _groundRightBoundary: number = 0;
    private _groundUpBoundary: number = 0;

    start() {
        let collider2D = this.ground.node.getComponent(BoxCollider2D)
        this._groundRightBoundary = this.ground.node.position.x + collider2D.offset.x + collider2D.size.width / 2;
        this._groundLeftBoundary = this.ground.node.position.x + collider2D.offset.x - collider2D.size.width / 2;
        this._groundUpBoundary = this.ground.node.position.y + collider2D.offset.y + collider2D.size.height / 2;
    }

    spawCube(prefab:Prefab) {
        let cube = instantiate(prefab)
        let cubeColider = cube.getComponent(BoxCollider2D)
        cube.setPosition(this._groundRightBoundary - cubeColider.size.x / 2, this._groundUpBoundary + cubeColider.size.y / 2);
        // cube.getComponent(RigidBody2D).applyLinearImpulseToCenter(new Vec2(-1, 0), true);
        cube.getComponent(RigidBody2D).linearVelocity=new Vec2(-5, 0);
        this._obstacles.push(cube)
        this.node.addChild(cube)
        return cube;
    }

    update(deltaTime: number) {
        if (this._obstacles.length > 0) {
            this.infoLabel.string = this._obstacles[0].position.toString()
            for (let obs of this._obstacles) {
                // 超出左边缘,销毁障碍物
                if (obs.position.x < this._groundLeftBoundary - obs.getComponent(BoxCollider2D).size.x / 2) {
                    this.destroyCube(obs)
                    this.infoLabel.string = "destroy cube";
                }
            }
        }
        if (this._obstacles.length == 0) {
            let cube = this.spawCube(this.highCube);
            this.infoLabel.string = "push cube";
        }

    }

    destroyCube(cube: Node) {
        this.node.removeChild(cube)
        this._obstacles.pop()
        cube.destroy()
    }
}

