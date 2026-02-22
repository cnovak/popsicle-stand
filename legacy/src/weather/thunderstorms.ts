import { Rainy } from "./rainy";

export class Thunderstorms extends Rainy {
  thunderstormEl = document.querySelector(".thunderstorm")!;
  boardWrapperEl = document.querySelector(".board-wrapper")!;

  getDemandChange() {
    return -40;
  }

  start() {
    super.start();
    this.boardWrapperEl.classList.add('dark-sky');
    const animation = this.thunderstormEl.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-200%)" }],
      {
        duration: this.engine.game.engine.animationSpeed * 3, //this.game.engine.animationSpeed,
        easing: "ease",
        fill: "forwards",
      }
    );
    return;
  }

  stop(): void {
    this.boardWrapperEl.classList.remove("dark-sky");
  }
}
