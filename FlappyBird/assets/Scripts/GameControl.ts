import {
  _decorator,
  CCInteger,
  Component,
  director,
  EventKeyboard,
  Input,
  input,
  KeyCode,
  Node,
} from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from './Ground';
import { Results } from './Results';
import { Bird } from './Bird';

@ccclass('GameControl')
export class GameControl extends Component {
  @property({
    type: Ground,
    tooltip: 'this is ground',
  })
  public ground: Ground;

  @property({
    type: Results,
    tooltip: 'results go here',
  })
  public result: Results;

  @property({
    type: Bird,
  })
  public bird: Bird;

  @property({
    type: CCInteger,
  })
  public speed: number = 300;

  @property({
    type: CCInteger,
  })
  public pipeSpeed: number = 200;

  onLoad() {
    this.initListener();

    this.result.resetScore();

    director.pause();
  }

  initListener() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.node.on(Node.EventType.TOUCH_START, () => {
      this.bird.fly();
    });
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.ESCAPE:
        this.gameOver();
        break;
      case KeyCode.SPACE:
        this.result.addScore();
        break;
      case KeyCode.ENTER:
        this.resetGame();
        this.bird.resetBird();
    }
  }

  startGame() {
    this.result.hideResults();
    director.resume();
  }

  gameOver() {
    this.result.showResults();
    director.pause();
  }

  resetGame() {
    this.result.resetScore();

    this.startGame();
  }
}
