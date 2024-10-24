import { _decorator, Component, Enum, Node, Sprite } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

export enum Tags{
    groud=0,
    player=1,
    enemy=2,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Player)
    private player: Player | null = null;



    start() {

    }

    update(deltaTime: number) {

    }
}

