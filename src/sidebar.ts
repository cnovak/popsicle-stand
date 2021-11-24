export class Sidebar {
  // sidebar info
  dayEl= document.querySelector(".sidebar .day")!;
  moneyEl = document.querySelector(".sidebar .money")!;
  iceCreamSalePriceEl = document.querySelector(".sidebar .icecream-sale-price")!;
  iceCreamCountEl = document.querySelector(".sidebar .ice-cream-count")!;


  update(day: number, money: number, iceCreamSalePrice: number, iceCreamCount: number ) {
      // console.log(day, money, iceCreamSalePrice, iceCreamCount);
      this.dayEl.textContent = day.toString();
      this.moneyEl.textContent = money.toFixed(2).toString();
      this.iceCreamSalePriceEl.textContent = iceCreamSalePrice.toFixed(2).toString();
      this.iceCreamCountEl.textContent = iceCreamCount.toString();

  }

}