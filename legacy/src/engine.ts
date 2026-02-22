import { GameOverModal } from "./game-over-modal";
import { DayStartModal } from "./day-start-modal";
import { Sound } from "./sound";
import { Game } from "./game";
import { Sidebar } from "./sidebar";
import { DayResultModal } from "./day-result-modal";
import { GameEndModal } from "./game-end-modal";

export class Engine {
  sound = new Sound(this);
  gameOverModal: GameOverModal = new GameOverModal(this);
  dayStartModal: DayStartModal | null = null;
  sideBar: Sidebar = new Sidebar();
  dayResultModal: DayResultModal | null = null;
  game: Game | null = null;
  readonly animationSpeed = 1000;
  gameEndModal: GameEndModal | null = null;

  constructor() {}

  run() {
    this.gameOverModal.display();
    // this.startGame("Player 1");
  }

  startGame(userName: string) {
    console.log("Game start", userName);
    this.game = new Game(this, this.sideBar, userName);
    this.dayStartModal = new DayStartModal(this.game);
    this.dayResultModal = new DayResultModal(this.game);
    this.gameEndModal = new GameEndModal(this.game);

    this.game.start();
  }

  showEndGameModal() {
    this.gameEndModal?.display();
  }

  endGame() {
    this.gameEndModal?.destroy();
    this.dayStartModal?.destroy();
    this.dayResultModal?.destroy();
    this.gameOverModal.addHighScore(
      this.game!.playerName,
      this.game!.store.cash
    );
    this.game?.destroy();
    this.run();
  }
}
