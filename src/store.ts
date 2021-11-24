import { Game } from "./game";

export class Store {
  cash = 5;
  iceCreamCount = 0;
  iceCreamSalePrice = 0;
  iceCreamDayStartCount = 0;
  dayStartCash = 0;
  berriesPerIceCream = 10;

  standEl = <HTMLElement>document.querySelector(".stand")!;
  //   soundBtn: document.querySelector(".sound"),
  //   makeBtn: document.querySelector(".make"),
  //   iceCreamCountEl: document.querySelector(".ice-cream-count"),

  //   moneyEl: document.querySelector(".sidebar-money"),
  //   sidebarDayEl: document.querySelector(".sidebar-day"),
  //   sidebarIceCreamSalePriceEl: document.querySelector(".sidebar-icecream-price"),
  //   icecreamCostEl: document.querySelector(".icecream-cost"),
  icecreamSignEl = document.querySelector(".stand .sign .price")!;
  constructor(private game: Game) {}

  openStand(): any {
    this.iceCreamDayStartCount = this.iceCreamCount;
    this.icecreamSignEl.textContent =
      this.game.store.iceCreamSalePrice.toFixed(2);
    // set up p
    // const boardL = Number(this.gameBoardEl.offsetLeft);
    // const standL = Number(this.standEl.offsetLeft);
    const boardWidth = this.game.gameBoardEl.clientWidth;
    // console.log("boardL:", boardL, "standL:", standL);
    const translateX = boardWidth * -0.85;
    // console.log("Store translate: " + translateX);
    const promise = this.standEl.animate(
      [
        { transform: "translate(0)" },
        { transform: "translate(" + translateX + "px)" },
      ],
      {
        duration: this.game.engine.animationSpeed, //this.game.engine.animationSpeed,
        easing: "ease-out",
        fill: "forwards",
      }
    );
    return promise;
  }

  closeStand() {
    this.dayStartCash = this.cash;
  }

  buy() {
    //console.log('dayStartCash', this.dayStartCash);
    this.iceCreamCount--;
    this.cash += this.iceCreamSalePrice;
    this.game.updateSideBar();
    this.game.engine.sound.playAddPoint();
  }
}
