export class Modal {
  protected modalEl: Element;
  protected overlayEl = document.querySelector(".overlay")!;
  protected id: string;

  constructor(modalSelectors: string) {
    this.id = this.id = new Date().getMilliseconds() + '@' + this.constructor.name;
    console.log('+++ Creating ' + this.id);
    this.modalEl = document.querySelector(modalSelectors)!;
    if(!this.modalEl) {
        throw new Error('modal not found using selector:' + modalSelectors);
    }
  }

  destroy() {
    console.log('+++ Destroy: ' + this.id);
  }

  openModal() {
    this.modalEl.classList.remove("hidden");
    this.overlayEl.classList.remove("hidden");
  }

  closeModal() {
    this.modalEl.classList.add("hidden");
    this.overlayEl.classList.add("hidden");
  }
}
