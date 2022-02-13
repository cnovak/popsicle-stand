import { delay } from "rxjs";
import { Engine } from "./engine";
import { Kid } from "./kid";
import { Sidebar } from "./sidebar";
import { Store } from "./store";
import { WeatherEngine } from "./weather/weather-engine";

export class Game {
  berryCost = 0.05;
  currentDay = 0;
  //kidQueue: Kid[] = [];
  maxDays = 5;

  gameBoardEl = <HTMLElement>document.querySelector(".board")!;
  fadeOutEl = <HTMLElement>document.querySelector(".fade-out")!;
  weatherEngine: WeatherEngine;

  public store = new Store(this);

  constructor(
    public engine: Engine,
    public sideBar: Sidebar,
    public playerName: string
  ) {
    this.weatherEngine = new WeatherEngine(this);
  }

  destroy() {}

  start() {
    this.startNextDay();
  }

  updateSideBar() {
    this.engine.sideBar.update(
      this.currentDay,
      this.store.cash,
      this.store.iceCreamSalePrice,
      this.store.iceCreamCount
    );
  }

  startNextDay() {
    this.store.closeStand();
    if (this.currentDay < this.maxDays) {
      this.currentDay++;
      this.weatherEngine.incrementDay();
      console.log(`------------- Day ${this.currentDay} -------------`);
      console.log('Weather:', this.weatherEngine.weatherStack);
      this.engine.dayStartModal?.display(this);
    } else {
      // game over
      this.engine.showEndGameModal();
    }
  }

  runDay() {
    // console.log("udpate1 this", this);
    // console.log("update2 store", this.store);
    this.updateSideBar();

    this.weatherEngine.startWeather();

    //animation: progressBar 10s linear 2s infinite;
    // console.log("------- run day -------");
    this.store.openStand().finished.then(() => {
      // console.log("------- generate -------");
      // Determine supply
      let customers = 0;
      let totalDemand = this.calcDemand(
        this.engine.game?.store.iceCreamSalePrice
      );

      // Cannot have more customers than you have popsicles.
      if (totalDemand > this.engine.game!.store.iceCreamCount) {
        customers = this.engine.game!.store.iceCreamCount;
      } else {
        customers = totalDemand;
      }
      console.log(
        `Total Demand: ${totalDemand} @ ${this.store.iceCreamSalePrice}, ice cream: ${this.store.iceCreamCount}, Customers: ${customers} `
      );

      const p = this.generateTraffic(customers);
      // console.log("# Customers:", p);
      p.then(() => {
        this.fadeOut().then(() => {
          this.fadeOutEl.classList.add("hidden");
          throw new Error("Method not implemented.");
          // console.log("opening modl");
          // if (this.engine.dayResultModal) {
          //   this.engine.dayResultModal.display();
          // } else {
          //   console.error("day result modal is null");
          // }
          // this.weatherEngine.stopWeather();
        });
      });
    });
  }
  private fadeOut(): Promise<Animation> {
    this.fadeOutEl.classList.remove("hidden");
    return this.fadeOutEl.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 1000,
    }).finished;
  }

  generateTraffic(count: number): Promise<Kid[]> {
    // console.log("KidQueue:", this.kidQueue);
    let kidPromises: Promise<Kid>[] = [];
    let delay = 500;
    for (let i = 0; i < count; i++) {
      // console.log("kid");
      const p = new Promise<Kid>((resolve) => {
        setTimeout(() => {
          const kid = new Kid(i, this);
          // console.log("kid!");
          kid.goToStand(kid).then(() => {
            resolve(kid);
          });
        }, delay);
      });
      // console.log("push");
      kidPromises.push(p);
      delay = Math.random() * 2000;
    }
    // console.log(kidPromises);
    return Promise.all(kidPromises) as Promise<Kid[]>;
  }

  calcDemand(icecreamSalePrice: any): number {
    //let multiplier = weather * 0.1;
    const weather = 1;
    // 20 will affect curve, 6.5 is slope
    //let demand = 20 - 6.5 * this.store.iceCreamSalePrice - .5 * (10 - this.store.berriesPerIceCream ) //+ 1 * (weather - 30);

    // More fun demand curve
    let demand =
      60 -
      15.5 * this.store.iceCreamSalePrice +
      (this.store.berriesPerIceCream - 5) +
      this.weatherEngine.getCurrentWeather().getDemandChange();

    // 30 = 0 none, 130 , get 10 more

    //console.log(`calcDemand: berries:${this.store.berriesPerIceCream}, price:${this.store.iceCreamSalePrice} = ${demand}`);
    return demand <= 0 ? 1 : demand;
  }
}
