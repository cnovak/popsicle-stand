import { VirtualTimeScheduler } from "rxjs";
import { Game } from "./game";

export class Kid {
  static icons = ["🧍🏻‍♀️", "🧍🏼‍♀️", "🧍🏽‍♀️", "🧍🏾‍♀️", "🧍🏿‍♀️", "🧍🏻‍♂️", "🧍🏼‍♂️", "🧍🏽‍♂️", "🧍🏾‍♂️", "🧍🏿‍♂️"];

  kidEl: HTMLDivElement;
  iconIdx: number;
  icon: string;
  x = 0;
  kidAnimationSpeed = this.game.engine.animationSpeed * 3;

  constructor(public id: number, private game: Game) {
    this.iconIdx = Math.floor(Math.random() * 10);
    this.icon = Kid.icons[this.iconIdx];
    this.kidEl = this.createEl();
  }

  createEl() {
    let el = document.createElement("div");
    el.textContent = this.icon;
    // console.log("THIS:", this);
    // console.log("CONTENT1:" + el.textContent);
    // console.log("CONTENT:" + el.textContent);
    el.classList.add("big-emoji");
    el.classList.add("kid");
    el.classList.add("kid-" + this.id);
    this.game.gameBoardEl.appendChild(el);
    return el;
  }

  goToStand(kid: Kid): Promise<any> {
    // console.log("gotostand", kid.icon);

    const boardWidth = this.game.gameBoardEl.clientWidth;

    let translateX = boardWidth * -0.85;
    // remove queue length
    //const queueWidth = this.kidEl.clientWidth / 2;
    //translateX += this.game.kidQueue.length * queueWidth;
    // add kid to queue
    //this.game.kidQueue.push(kid);
    this.x = translateX;

    // console.log('Translate kid:' + translateX + "px");
    // console.log('speed:' + this.game.engine.animationSpeed + "leaving stand: " + this.id );
    return this.kidEl
      .animate(
        [
          { transform: "translate(0)" },
          { transform: "translate(" + translateX + "px)" },
        ],
        {
          duration: this.kidAnimationSpeed,
          easing: "ease-out",
          fill: "forwards",
        }
      )
      .finished.then(() => {
        // console.log("goto stand finsihed:", this);

        // // remove a kid from the queue
        // if (this.game.kidQueue.length > 0) {
        //   const kidLeave = <Kid>this.game.kidQueue.shift();
        //   return this.leaveStand(kidLeave);
        // }
        this.game.store.buy();
        this.leaveStand();
      });
  }

  leaveStand() {
    // console.log("leaving stand: " + this.id);
    //const curX = this.kidEl.computedStyleMap().get("transform")[0]?.x;
    const newX = -(this.game.gameBoardEl.clientWidth + this.kidEl.clientWidth);
    // console.log("leaving stand: " + Date.now());
    const animation = this.kidEl.animate(
      [
        { transform: "translateX(" + this.x + "px)" },
        { transform: "translateX(" + newX + "px)" },
      ],
      {
        duration: this.kidAnimationSpeed,
        easing: "ease-out",
        fill: "forwards",
      }
    );
    this.x = newX;
    return animation.finished;
  }
}
