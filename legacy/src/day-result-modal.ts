import { Game } from "./game";
import { Modal } from "./modal";
import { fromEvent, Observable, Subscription } from 'rxjs';

export class DayResultModal extends Modal{
    private game:Game;

    private currentDayEl = document.querySelector('.day-result-modal .day')!;
    private iceCreamSoldEl = document.querySelector('.day-result-modal .icecream-sold')!;
    private iceCreamSold2El = document.querySelector('.day-result-modal .icecream-sold2')!;
    private iceCreamSalePriceEl = document.querySelector('.day-result-modal .icecream-sale-price')!;
    private profitPerItemEl = document.querySelector('.day-result-modal .icecream-profit-per-item')!;
    private totalProfitEl = document.querySelector('.day-result-modal .total-profit')!;
    private revenueEl = document.querySelector('.day-result-modal .revenue')!;
    private startingCashEl = document.querySelector('.day-result-modal .starting-cash')!;
    private cashEl = document.querySelector('.day-result-modal .cash')!;
    private inventoryEl = document.querySelector('.day-result-modal .inventory')!;
    private okButton = document.querySelector('.day-result-modal button.ok')!;

    private oKButtonSubscription: Subscription;

    constructor(game:Game) {
        super('.day-result-modal');
        this.game = game;
        this.oKButtonSubscription = fromEvent(this.okButton, 'click').subscribe(() => {
            this.closeModal();
            this.game.startNextDay();
        });
    }

    destroy() {
        super.destroy();
        this.oKButtonSubscription.unsubscribe();
    }

    display() {
        this.init();
        this.openModal();
    }

    private init() {
        this.currentDayEl.textContent = this.game?.currentDay.toString()!;
        const iceCreamSold = this.game.store.iceCreamDayStartCount - this.game.store.iceCreamCount;
        this.iceCreamSoldEl.textContent = iceCreamSold.toString();
        this.iceCreamSold2El.textContent = iceCreamSold.toString();
        const profitPerItem = this.game.store.iceCreamSalePrice - (this.game.berryCost * this.game.store.berriesPerIceCream);
        this.profitPerItemEl.textContent = profitPerItem.toFixed(2).toString();
        this.totalProfitEl.textContent = (profitPerItem * iceCreamSold).toFixed(2).toString();
        this.iceCreamSalePriceEl.textContent = this.game.store.iceCreamSalePrice.toFixed(2).toString();
        this.revenueEl.textContent = (iceCreamSold * this.game.store.iceCreamSalePrice).toFixed(2).toString();
        this.startingCashEl.textContent = this.game.store.dayStartCash.toFixed(2).toString();
        this.cashEl.textContent = this.game.store.cash.toFixed(2).toString();
        this.inventoryEl.textContent = this.game.store.iceCreamCount.toString();

        console.log(`Sales: ${iceCreamSold.toFixed(2)} x ${this.game.store.iceCreamSalePrice.toFixed(2)} = ${(iceCreamSold * this.game.store.iceCreamSalePrice).toFixed(2)}`);
        console.log(`Cash: ${this.game.store.dayStartCash.toFixed(2)} >  ${this.game.store.cash.toFixed(2)}, Inventory: ${this.game.store.iceCreamCount}`);
    }
}