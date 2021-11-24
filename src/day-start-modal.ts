import { fromEvent, Subscription } from "rxjs";
import { Game } from "./game";
import { Modal } from "./modal";

export class DayStartModal extends Modal {
  playerNameEl = document.querySelector('.day-start-modal .player-name')!;
  inventoryCountEl = document.querySelector('.day-start-modal .current-ice-cream-count')!;
  inventoryNewCountEl = document.querySelector('.day-start-modal .create-ice-cream-count')!;
  berryCountEl = document.querySelector(".berry-count")!;
  berryCostPerItemEl = document.querySelector('.berries-per-item-cost')!;
  dayEl = document.querySelector(".day-start-modal .day")!;
  cashEl = <HTMLInputElement>document.querySelector(".day-start-modal .cash")!;
  cashErrorEl = document.querySelector(".day-start-modal .cash-error");
  berryInputEl = <HTMLInputElement>document.querySelector(".berry-slider");
  berryCostEl = document.querySelector(".berry-cost")!;
  icecreamCountEl = <HTMLInputElement>document.querySelector(".icecream-count");
  goBtn = document.querySelector(".day-start-modal button.go")!;
  icecreamCountErrorEl = document.querySelector(".icecream-count-error");
  icecreamSalePriceEl = <HTMLInputElement>document.querySelector(".icecream-price");
  icecreamSalePriceErrorEl = document.querySelector(".icecream-price-error");
  okButton = document.querySelector(".day-result-modal button")!;

  cash: number = 0;
  iceCreamCount: number = 0;
  iceCreamSalePrice = .50;

  berryInputSubscription: Subscription;
  goButtonSubscription: Subscription;
  iceCreamCountSubscription: Subscription;
  iceCreamSalePriceSubscription: Subscription;

  constructor(private game:Game) {
    super(".day-start-modal");
 
    this.berryInputSubscription = fromEvent(this.berryInputEl, 'input').subscribe( (e: Event) => {
      this.game.store.berriesPerIceCream = +(<HTMLInputElement>e.target).value;
      this.updateDisplay();
    });

    this.iceCreamCountSubscription = fromEvent(this.icecreamCountEl, 'input').subscribe((e: Event) => {
      this.iceCreamCount = +(<HTMLInputElement>e.target).value;
      this.updateDisplay();
    });

    this.iceCreamSalePriceSubscription = fromEvent(this.icecreamSalePriceEl,'mouseup').subscribe(() => {
      this.iceCreamSalePrice = +(<HTMLInputElement>this.icecreamSalePriceEl).value;
      this.updateDisplay();
    });

    this.goButtonSubscription = fromEvent(this.goBtn, 'click').subscribe(() => {
      if (!this.isValid()) {
        return;
      }

      // Valid, update values in game
      if (this.game) {
        this.game.store.iceCreamCount += +this.icecreamCountEl.value;
        this.game.store.cash = +this.cashEl.textContent!;
        this.game.store.iceCreamSalePrice = +this.icecreamSalePriceEl.value;
        this.closeModal();
        console.log("Run Day", this.id);
        this.game.runDay();
      } else {
        console.error("Game not initialized in DayStartModal");
      }
    });
  }

  destroy() {
    super.destroy();
    this.berryInputSubscription.unsubscribe();
    this.goButtonSubscription.unsubscribe();
    this.iceCreamCountSubscription.unsubscribe();
    this.iceCreamSalePriceSubscription.unsubscribe();
  }

  display(game: Game) {
    this.game = game;
    this.init();
    this.openModal();
  }

  init() {
    this.playerNameEl.textContent = this.game.playerName;
    this.dayEl.textContent = this.game.currentDay.toString();
    
    // berries per icecream
    this.cash = this.game.store.cash;

    this.icecreamCountEl.value = this.iceCreamCount.toString();
    this.icecreamSalePriceEl.value = this.iceCreamSalePrice.toFixed(2).toString();
  
    // update cash
    this.updateDisplay();
  }

  updateDisplay() {

    // inventory
    this.inventoryCountEl.textContent = this.game.store.iceCreamCount.toString();
    this.inventoryNewCountEl.textContent = this.iceCreamCount.toString();
    // berries per icecream
    this.berryInputEl.value = this.game.store.berriesPerIceCream.toString();
    this.berryCountEl.textContent = this.game.store.berriesPerIceCream.toString();
    // display berry cost
    this.berryCostEl.textContent = this.game.berryCost.toFixed(2);
    // calc berry cost per item
    this.berryCostPerItemEl.textContent = (this.game.store.berriesPerIceCream * this.game.berryCost).toFixed(2).toString();
    // update cash
    const futureCash = this.cash - (this.iceCreamCount * (this.game.store.berriesPerIceCream * this.game.berryCost));
    this.cashEl.textContent = futureCash.toFixed(2);
    // show red if cash is negative
    if(futureCash < 0) {
      this.cashEl.classList.add('error');
    } else {
      this.cashEl.classList.remove('error');
    }
    // Sale price of ice cream
    //console.log('this.iceCreamSalePrice.toFixed(2);', this.iceCreamSalePrice.toFixed(2));
    this.icecreamSalePriceEl.textContent = this.iceCreamSalePrice.toFixed(2);
  }

  isValid(): boolean {
    let isError = false;
    if (!this.icecreamCountEl.checkValidity()) {
      this.icecreamCountErrorEl!.innerHTML =
        this.icecreamCountEl.validationMessage;
      isError = true;
    }
    if (!this.icecreamSalePriceEl!.checkValidity()) {
      this.icecreamSalePriceErrorEl!.innerHTML =
        this.icecreamSalePriceEl!.validationMessage;
      isError = true;
    }

    // Check cash is positive
    const cash = Number(this.cashEl.textContent);
    if (cash < 0) {
      this.cashErrorEl!.innerHTML =
        "🚫 You don't have enough money, try again 🔄";
      isError = true;
    }

    if (isError) {
      return false;
    } else {
      let errorEls = document.querySelectorAll(".error");
      for (let i = 0; i < errorEls.length; i++) {
        errorEls[i].innerHTML = "";
      }
      return true;
    }
  }
}
