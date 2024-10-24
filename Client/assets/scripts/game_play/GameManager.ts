import { _decorator, Component, Enum, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

export enum Tags{
    GROUND=0,
    PLAYER=1,
    ENEMY=2,
}

@ccclass('GameManager')
export class GameManager extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
}

