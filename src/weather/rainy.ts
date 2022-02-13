import { Weather } from "./weather";

export class Rainy extends Weather {
  rainFrontRowEl = <HTMLElement>(
    document.querySelector(".rain-wrapper .front-row")!
  );

  getDemandChange() {
    return -20;
  }

  start() {
    
    var increment = 0;
    let theDropsHtml = "";
    while (increment < 500) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      //random number between 5 and 2
      var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
      //increment
      increment += randoFiver / 5;
      //var innerDrip = //add in a new raindrop with various randomizations to certain CSS properties
      theDropsHtml +=
        '<div class="drop" style="left: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"><div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div><div class="splat" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div></div>';
    }
    this.rainFrontRowEl.innerHTML = theDropsHtml;
  }

  stop(): void {
    this.rainFrontRowEl.innerHTML = '';
  }
}
