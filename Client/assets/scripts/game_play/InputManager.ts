import { _decorator, Component, EventKeyboard, Input, input, KeyCode, log, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum DinoInputEvent {
    INPUT_EVENT_IDLE,
    INPUT_EVENT_UP,
    INPUT_EVENT_RIGHT,
    INPUT_EVENT_DOWN,
};

export const INPUT_MANAGER_EVENT: string = "INPUT_MANAGER_EVENT";

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
                    this.node.emit(INPUT_MANAGER_EVENT,DinoInputEvent.INPUT_EVENT_UP);
                    break;
                case KeyCode.ARROW_DOWN:
                    this.node.emit(INPUT_MANAGER_EVENT,DinoInputEvent.INPUT_EVENT_DOWN);
                    break;
                case KeyCode.ARROW_RIGHT:
                    this.node.emit(INPUT_MANAGER_EVENT,DinoInputEvent.INPUT_EVENT_RIGHT);
                    break;
                default:
                    this.node.emit(INPUT_MANAGER_EVENT,DinoInputEvent.INPUT_EVENT_IDLE);
                    break;
            }
        }, this);
    }


}


