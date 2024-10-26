import { _decorator, Component, EventKeyboard, Input, input, KeyCode, log, Node } from 'cc';
import { DINO_EVENT_INPUT_MANAGER } from '../DinoStringTable';
const { ccclass, property } = _decorator;

export enum DinoInputEvent {
    INPUT_EVENT_IDLE,
    INPUT_EVENT_UP,
    INPUT_EVENT_RIGHT,
    INPUT_EVENT_DOWN,
    INPUT_EVENT_DEBUG_GEN_FOOD,
};

/*
Class: InputManager
Usage: 
    监听用户输入，其它component通过on函数来注册事件
    ** 永远不要引用任何其它component **
*/
@ccclass('InputManager')
export class InputManager extends Component {
    start() {
        input.on(Input.EventType.KEY_UP, (event: EventKeyboard) => {
            switch (event.keyCode) {
                case KeyCode.ARROW_UP:
                    this.node.emit(DINO_EVENT_INPUT_MANAGER, DinoInputEvent.INPUT_EVENT_UP);
                    break;
                case KeyCode.ARROW_DOWN:
                    this.node.emit(DINO_EVENT_INPUT_MANAGER, DinoInputEvent.INPUT_EVENT_DOWN);
                    break;
                case KeyCode.ARROW_RIGHT:
                    this.node.emit(DINO_EVENT_INPUT_MANAGER, DinoInputEvent.INPUT_EVENT_RIGHT);
                    break;
                case KeyCode.KEY_P:
                    this.node.emit(DINO_EVENT_INPUT_MANAGER, DinoInputEvent.INPUT_EVENT_DEBUG_GEN_FOOD);
                    break;
                default:
                    this.node.emit(DINO_EVENT_INPUT_MANAGER, DinoInputEvent.INPUT_EVENT_IDLE);
                    break;
            }
        }, this);
    }


}


