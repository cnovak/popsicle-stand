import { Weather } from "./weather";

export class Sunny extends Weather {
  sunEl = document.querySelector(".sun")!;

  getDemandChange() {
    return 0;
  }

  start(): void {
    const animation = this.sunEl.animate(
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
    return;
  }

}
