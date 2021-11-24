import { Game } from "./game";
import { Modal } from "./modal";
import { fromEvent, Subscription } from 'rxjs';

export class GameEndModal extends Modal{
    private game:Game;

    private daysEl = document.querySelector('.end-game-modal .days')!;
    private cashEl = document.querySelector('.end-game-modal .cash')!;
    private OkButton = document.querySelector('.end-game-modal button.ok')!;

    private okButtonSubscription: Subscription;

    constructor(game:Game) {
        super('.end-game-modal');
        this.game = game;
        this.okButtonSubscription = fromEvent(this.OkButton, 'click').subscribe(() => {
            this.closeModal();
            this.game.engine.endGame();
        });
    }

    destroy() {
        super.destroy();
        this.okButtonSubscription.unsubscribe();
    }

    display() {
        this.init();
        this.openModal();
    }

    private init() {
        this.daysEl.textContent = this.game.currentDay.toString();
        this.cashEl.textContent = this.game.store.cash.toFixed(2).toString();

    }
}