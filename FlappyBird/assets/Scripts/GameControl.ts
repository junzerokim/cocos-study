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
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from './Ground';
import { Results } from './Results';
import { Bird } from './Bird';
import { PipePool } from './PipePool';

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
    type: PipePool,
  })
  public pipeQueue: PipePool;

  @property({
    type: CCInteger,
  })
  public speed: number = 300;

  @property({
    type: CCInteger,
  })
  public pipeSpeed: number = 200;

  public isOver: boolean;

  onLoad() {
    this.initListener();
    this.result.resetScore();
    this.isOver = true;
    director.pause();
  }

  initListener() {
    input.on(Input.EventType.KEY_DOWN, () => {}, this);
    this.node.on(Node.EventType.TOUCH_START, () => {
      if (this.isOver) {
        this.resetGame();
        this.bird.resetBird();
        this.startGame();
      }

      if (!this.isOver) {
        this.bird.fly();
      }
    });
  }

  // onKeyDown(event: EventKeyboard) {
  //   switch (event.keyCode) {
  //     case KeyCode.ESCAPE:
  //       this.gameOver();
  //       break;
  //     case KeyCode.SPACE:
  //       this.result.addScore();
  //       break;
  //     case KeyCode.ENTER:
  //       this.resetGame();
  //       this.bird.resetBird();
  //   }
  // }

  startGame() {
    this.result.hideResults();
    director.resume();
  }

  gameOver() {
    this.result.showResults();
    this.isOver = true;
    director.pause();
  }

  resetGame() {
    this.result.resetScore();
    this.pipeQueue.reset();
    this.isOver = false;
    this.startGame();
  }

  passPipe() {
    this.result.addScore();
  }

  createPipe() {
    this.pipeQueue.addPool();
  }

  contactGroundPipe() {
    let collider = this.bird.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(selfColllider: Collider2D, otherCOllider: Collider2D, contact: IPhysics2DContact | null) {
    this.bird.hitSomething = true;
  }

  birdStruck() {
    this.contactGroundPipe();

    if (this.bird.hitSomething) {
      this.gameOver();
    }
  }

  update() {
    if (this.isOver == false) {
      this.birdStruck();
    }
  }
}
