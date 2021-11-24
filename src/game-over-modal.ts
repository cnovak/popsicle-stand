import { Engine } from "./engine";
import { Modal } from "./modal";

export class GameOverModal extends Modal {

  private newGameBtn = document.querySelector(".game-over-modal button.new-game")!;
  private nameWrapper = document.querySelector(".game-over-modal .name-wrapper")!;
  private nameInput = <HTMLInputElement>document.querySelector(".game-over-modal input.name")!;
  private goBtn = document.querySelector(".game-over-modal button.go")!;
  private highScoresList = document.querySelector(".game-over-modal .high-scores-list")!;

  private highScores: Array<{name:string, score:number}> = [];

  constructor(private engine: Engine) {
    super('.game-over-modal')
    this.newGameBtn.addEventListener("click", () => {
        // display user name fields
        this.newGameBtn.classList.add("hidden");
        this.nameWrapper.classList.remove("hidden");
        this.engine.sound.playAddPoint();
    });

    this.goBtn.addEventListener("click", () => {
        this.closeModal();

        engine.startGame(this.nameInput.value);

    });

    this.loadHighScores();
  }

  display() {
      this.displayHighScores();
      this.openModal();
  }

  loadHighScores() {
    this.highScores = JSON.parse(window.localStorage.getItem('highScores')!) || [];
  }

  storeHighScores() {
    window.localStorage.setItem('highScores', JSON.stringify(this.highScores));
  }

  displayHighScores(){
    // remove old list
    while (this.highScoresList.firstChild) {
        this.highScoresList.removeChild(this.highScoresList.firstChild);
    }
    // add current list
    // console.log("highscores", this.highScores);
    for(let i = 0; i < 10 && i < this.highScores.length ; i++) {
        // console.log("score", this.highScores[i]);
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${this.highScores[i].name}: $${this.highScores[i].score.toFixed(2)}`));
        li.setAttribute("id", "element4"); // added line
        this.highScoresList.appendChild(li);
    }

    // If highscores are empty, say it
    if(this.highScores.length === 0) {
      const noScoresEl = document.createElement("span");
      noScoresEl.textContent = '👉🏻 No high scores, play today! 👈🏻';
      noScoresEl.classList.add('.medium-emoji');
      this.highScoresList.appendChild(noScoresEl);
    }
    
  }

  addHighScore(name: string, score: number) {
    console.log("adding high score: " + name + " " + score);
    this.highScores.push({name: name, score: score});
    this.highScores.sort((a, b) => {
        return b.score - a.score;
    })
    this.storeHighScores();
  }

  openModal() {
    super.openModal();
    this.nameWrapper.classList.add("hidden");
    this.newGameBtn.classList.remove("hidden");
  }
}
