import { Engine } from "./engine";
import { GameEndModal } from "./game-end-modal";
import { Kid } from "./kid";
import { Sidebar } from "./sidebar";
import { Store } from "./store";

export class Game {
  berryCost = 0.05;
  currentDay = 0;
  //kidQueue: Kid[] = [];
  maxDays = 5;

  gameBoardEl = <HTMLElement>document.querySelector(".board")!;

  public store = new Store(this); 

  constructor(
    public engine: Engine,
    public sideBar: Sidebar,
    public playerName: string
  ) {}

  start() {
    // console.log("starting");
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
    if(this.currentDay < this.maxDays) {
      this.currentDay++;
      console.log(`------------- Day ${this.currentDay} -------------`);
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
        if(this.engine.dayResultModal) {    
          this.engine.dayResultModal.display();
        } else {
          console.error('day result modal is null');
          
        }
      });
    });
  }

  generateTraffic(count: number): Promise<Kid[]> {
    // console.log("KidQueue:", this.kidQueue);
    let kidPromises = [];
    let delay = 500;
    for (let i = 0; i < count; i++) {
      // console.log("kid");
      const p = new Promise((resolve) => {
        setTimeout(() => {
          const kid = new Kid(i, this);
          // console.log("kid!");
          kid.goToStand(kid).then(() => {
            resolve(null);
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
    let demand = 20 - 6.5 * this.store.iceCreamSalePrice - .5 * (10 - this.store.berriesPerIceCream ) //+ 1 * (weather - 30);
    // 30 = 0 none, 130 , get 10 more

    //console.log(`calcDemand: berries:${this.store.berriesPerIceCream}, price:${this.store.iceCreamSalePrice} = ${demand}`);
    return demand < 0 ? 0 : demand;
  }
  

}
