export class GameOver {
  constructor(engine) {
    this.engine = engine;
    this.highScores = [];
    this.modalEl = document.querySelector(".game-over-modal");
    this.overlayEl = document.querySelector(".overlay");
    this.newGameBtn = document.querySelector(".game-over-modal button.new-game");
    this.nameWrapper = document.querySelector(".game-over-modal .name-wrapper");
    this.nameInput = document.querySelector(".game-over-modal input.name");
    this.goBtn = document.querySelector(".game-over-modal button.go");
    this.highScoresList = document.querySelector(".game-over-modal .high-scores-list");

    

    this.newGameBtn.addEventListener("click", () => {
        // display user name fields
        this.newGameBtn.classList.add("hidden");
        this.nameWrapper.classList.remove("hidden");
    });

    this.goBtn.addEventListener("click", () => {
        this.closeModal();
        engine.startGame(this.nameInput.value);

    });

    this.loadHighScores();
  }

  display() {
      this.openModal();
      this.displayHighScores();
  }

  loadHighScores() {
    this.highScores = JSON.parse(window.localStorage.getItem('highScores')) || [];
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
    console.log("highscores", this.highScores);
    for(let i = 0; i < this.highScores.length; i++) {
        console.log("score", this.highScores[i]);
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${this.highScores[i].name}: ${this.highScores[i].score}`));
        li.setAttribute("id", "element4"); // added line
        this.highScoresList.appendChild(li);
    }
    
  }

  addHighScore(name, score) {
    this.highScores.push({name: name, score: score});
    this.highScores.sort((a, b) => {
        return b.score - a.score;
    })
    this.storeHighScores();
  }

  openModal() {
    this.modalEl.classList.remove("hidden");
    this.overlayEl.classList.remove("hidden");
    this.nameWrapper.classList.add("hidden");
    this.newGameBtn.classList.remove("hidden");
  }

  closeModal() {
    // console.log("close dayresult modal");
    this.modalEl.classList.add("hidden");
    this.overlayEl.classList.add("hidden");
  }
}
