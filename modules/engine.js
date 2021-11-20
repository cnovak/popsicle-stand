import { GameOver } from "./game-over.js";
import {Sound} from "./sound.js";

export class Engine {
  constructor() {
    this.userName = "";
    // this.isGameRunning = false;
    // this.iceCreamCount = 0;
    // this.startIcecreamCount = 0;
    // this.icecreamSalePrice = 0;
    // this.icecreamCost = 0;
    // this.kidQueue = [];
    // this.daylength = 5000;
    // this.day = 1;
    // this.cash = 3.0;
    // this.startCash = 0;
  }

  main() {
    this.soundBtn.addEventListener("click", () => {
        Sound.init();
        Sound.toggleSound();
      });

    this.gameOver = new GameOver(this);
    this.gameOver.display();

  }

  startGame(userName) {
    console.log("Game start", userName);
    this.userName = userName;
  }

  endGame() {
    this.gameOver.addHighScore(userName, Math.random() * 100);
    this.gameOver.display();
  }
}
