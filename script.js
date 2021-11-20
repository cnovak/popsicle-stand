"use strict";

const BERRY_COST = 0.05;

const Sound = {
  isSoundOn: false,
  soundList: [],
  backgroundMusicEl: document.querySelector("#background-music"),

  init() {
    Sound.playAddPoint();
    if (Sound.isSoundOn) {
      Sound.playBackgroundMusic();
    }
  },

  playAddPoint: function () {
    this.play("audio/add-point.wav");
  },

  toggleSound: function () {
    if (this.isSoundOn) {
      this.isSoundOn = false;
      this.stopBackgroundMusic();
      Graphics.updateSoundBtnText("Sound On");
      engine.dayModal.updateSoundBtnText("Sound On");
    } else {
      this.isSoundOn = true;
      this.playBackgroundMusic();
      Graphics.updateSoundBtnText("Sound Off");
      engine.dayModal.updateSoundBtnText("Sound Off");
    }
  },

  playBackgroundMusic: function () {
    this.backgroundMusicEl.play();
  },

  stopBackgroundMusic: function () {
    this.backgroundMusicEl.pause();
  },

  play: function (sound) {
    if (!this.soundList[sound]) {
      this.soundList[sound] = new Audio(sound);
      this.soundList[sound].load();
    }
    this.soundList[sound].cloneNode(true).play();
  },
};

class Engine {
  constructor() {
    this.iceCreamCount = 0;
    this.startIcecreamCount = 0;
    this.icecreamSalePrice = 0;
    this.icecreamCost = 0;
    this.kidQueue = [];
    this.daylength = 5000;
    this.day = 1;
    this.cash = 3.0;
    this.startCash = 0;
    this.dayModal = new DayModal();
    this.dayResultModal = new DayResultModal();
    this.endGameModal = new EndGameModal();
  }

  startGame() {
    Graphics.init();
    Events.init();
    this.isGameRunning = true;
    Sound.init();

   
    this.showDayModal();
  }

  nextDay() {
    if ((this.day <= 1)) {
      this.day++;
      this.showDayModal();

    } else {
      // do something
      // console.log('here');
      this.endGameModal.setStats(this.cash, this.day);
      this.endGameModal.open();
    }
  }

  showDayModal() {
    console.log('------- show day modal -------');
    this.dayModal.setDay(this.day);
    this.dayModal.setCash(this.cash);

    this.dayModal.openModal();
  }

  runDay() {
    //animation: progressBar 10s linear 2s infinite;
    console.log('------- run day -------');
    Graphics.openStand().finished.then(function () {
      console.log('------- generate -------');
      // Determine supply
      let customers = 0;
      let totalDemand = engine.calcDemand(engine.icecreamSalePrice);
      
      // Cannot have more customers than you have popsicles.
      if (totalDemand > engine.iceCreamCount) {
        customers = engine.iceCreamCount;
      } else {
        customers = totalDemand;
      }
      console.log(
        `Total Demand: ${totalDemand} @ ${engine.icecreamSalePrice}, ice cream: ${engine.iceCreamCount}, Customers: ${customers} `
      );

      const p = engine.generateTraffic(customers);
      // console.log("# Customers:", p);
      p.then(() => {
        // console.log("opening modl");
        engine.dayResultModal.setStats(
          engine.day,
          engine.startIcecreamCount - engine.iceCreamCount,
          engine.icecreamSalePrice,
          engine.cash - engine.startCash,
          engine.cash
        );
        engine.dayResultModal.open();
      });
    });

    // console.log(
    //   "stand L T B R:",
    //   Graphics.standEl.offsetLeft,
    //   Graphics.standEl.offsetTop,
    //   Graphics.standEl.offsetBottom,
    //   Graphics.standEl.offsetRight
    // );
  }

  endDay() {
    Graphics.closeStand();
  }

  calcDemand(price) {
    //let multiplier = weather * 0.1;
    const weather = 1;
    // 20 will affect curve, 6.5 is slope
    let demand = 20 - 6.5 * price;
    console.log(`calcDemand: weather:${weather}, price:${price} = ${demand}`);
    return demand < 0 ? 0 : demand;
  }

  generateTraffic(count) {
    console.log("KidQueue:", engine.kidQueue);
    let kidPromises = [];
    let delay = 500;
    for (let i = 0; i < count; i++) {
      console.log("kid");
      const p = new Promise((resolve) => {
        setTimeout(() => {
          const kid = new Kid(i);
          console.log("kid!");
          Graphics.goToStand(kid).then(() => {
            resolve();
          });
        }, delay);
      });
      console.log("push");
      kidPromises.push(p);
      delay = Math.random() * 2000;
    }
    // console.log(kidPromises);
    return Promise.all(kidPromises);
  }

  sellIceCream(amount) {
    // console.log(amount);
    // console.log(this.iceCreamCount);
    this.iceCreamCount -= amount;
    Graphics.updateIceCreamCount(this.iceCreamCount);
    this.cash += this.icecreamSalePrice;
    Graphics.updateCashDisplay(this.cash);
  }
}

const Graphics = {
  gameBoardEl: document.querySelector(".board"),
  soundBtn: document.querySelector(".sound"),
  makeBtn: document.querySelector(".make"),
  iceCreamCountEl: document.querySelector(".ice-cream-count"),
  standEl: document.querySelector(".stand"),
  moneyEl: document.querySelector(".sidebar-money"),
  sidebarDayEl: document.querySelector(".sidebar-day"),
  sidebarIceCreamSalePriceEl: document.querySelector(".sidebar-icecream-price"),
  icecreamCostEl: document.querySelector(".icecream-cost"),
  icecreamSignEl: document.querySelector(".stand .sign .price"),
  animationSpeed: 100,

  init: function () {},
  updateSoundBtnText(text) {
    this.soundBtn.textContent = text;
  },

  updateDayDisplay(day) {
    this.sidebarDayEl.textContent = day;
  },

  updateCashDisplay(amount) {
    this.moneyEl.textContent = amount.toFixed(2);
  },

  updateIceCreamCount(total) {
    this.iceCreamCountEl.textContent = Number(total);
  },

  updateIceCreamCost(cost) {
    //this.icecreamCostEl.textContent = cost.toFixed(2);
  },

  updateIceCreamSalePrice(price) {
    this.sidebarIceCreamSalePriceEl.textContent = price.toFixed(2);
    this.icecreamSignEl.textContent = price.toFixed(2);
  },

  // TODO: rain: https://codemyui.com/add-8-bit-snow-website/

  openStand() {
    const boardL = Number(this.gameBoardEl.offsetLeft);
    const standL = Number(this.standEl.offsetLeft);
    const boardWidth = this.gameBoardEl.clientWidth;
    // console.log("boardL:", boardL, "standL:", standL);
    const translateX = boardWidth * -0.85;
    const promise = this.standEl.animate(
      [
        { transform: "translate(0)" },
        { transform: "translate(" + translateX + "px)" },
      ],
      {
        duration: this.animationSpeed,
        easing: "ease-out",
        fill: "forwards",
      }
    );
    return promise;
  },

  closeStand() {
    // const standL = Number(this.standEl.offsetLeft);
    const boardWidth = this.gameBoardEl.clientWidth;
    const standWidth = this.standEl.clientWidth;
    // return this.moveElOnGround(this.standEl, 120);
    // console.log("boardwidth", boardWidth);
    const curX = this.standEl.computedStyleMap().get("transform")[0]?.x;
    // console.log("close cur x:", curX);
    const curY = this.standEl.computedStyleMap().get("transform")[0]?.y;
    // console.log("close cur y:", curY);
    // const itemL = Number(this.standEl.offsetLeft);
    const newX = -(boardWidth + standWidth);
    const promise = this.standEl.animate(
      [
        { transform: "translateX(" + curX + ")" },
        { transform: "translateX(" + newX + "px)" },
      ],
      {
        duration: this.animationSpeed,
        easing: "ease-out",
        fill: "forwards",
      }
    );
    return promise;
  },

  goToStand(kid) {
    console.log("gotostand", kid.icon);
    const el = kid.el;
    const boardL = Number(this.gameBoardEl.offsetLeft);
    const kidL = Number(el.offsetLeft);
    const boardWidth = this.gameBoardEl.clientWidth;
    const tX = el.computedStyleMap().get("transform")[0]?.x;
    // console.log("boardL2:", boardL, el.textContent, "kidL2:", kidL, "tX:", tX);
    const kidQueue = engine.kidQueue;
    // console.log("kidQueue:", kidQueue.length, kidQueue);
    let translateX = boardWidth * -0.85;
    // remove queue length
    const queueWidth = el.clientWidth / 2;
    translateX += kidQueue.length * queueWidth;
    // add kid to queue
    kidQueue.push(kid);

    return el
      .animate(
        [
          { transform: "translate(0)" },
          { transform: "translate(" + translateX + "px)" },
        ],
        {
          duration: this.animationSpeed,
          easing: "ease-out",
          fill: "forwards",
        }
      )
      .finished.then(() => {
        // console.log("goto stand finsihed: " + Date.now());
        // remove a kid from the queue
        if (engine.kidQueue.length > 0) {
          const kidLeave = engine.kidQueue.shift();
          return this.leaveStand(kidLeave);
        }
      });
  },

  serveIceCream: function () {
    const kid = Engine.kidQueue.shift();
  },

  leaveStand: function (kid) {
    const kidEl = kid.el;
    // console.log("leaving stand");
    Sound.playAddPoint();

    // Update stats
    engine.sellIceCream(1);

    const curX = kidEl.computedStyleMap().get("transform")[0]?.x;
    const newX = -(this.gameBoardEl.clientWidth + kidEl.clientWidth);
    // console.log("leaving stand: " + Date.now());
    const animation = kidEl.animate(
      [
        { transform: "translateX(" + curX + ")" },
        { transform: "translateX(" + newX + "px)" },
      ],
      {
        duration: this.animationSpeed,
        easing: "ease-out",
        fill: "forwards",
      }
    );
    return animation.finished;
  },
};

const Kid = function (id) {
  // Randomize kid icon
  this.id = id;
  let icons = ["🧍🏻‍♀️", "🧍🏼‍♀️", "🧍🏽‍♀️", "🧍🏾‍♀️", "🧍🏿‍♀️", "🧍🏻‍♂️", "🧍🏼‍♂️", "🧍🏽‍♂️", "🧍🏾‍♂️", "🧍🏿‍♂️"];
  let iconIdx = Math.floor(Math.random() * 10);
  this.icon = icons[iconIdx];
  this.el = this.createEl();
  console.log("Kid created " + this.icon);
};

Kid.prototype.count = 0;
Kid.prototype.createEl = function () {
  let el = document.createElement("div");
  el.textContent = this.icon;
  el.classList.add("big-emoji");
  el.classList.add("kid");
  el.classList.add("kid-" + this.id);
  let gameEl = document.querySelector(".board");
  gameEl.appendChild(el);
  return el;
};

class DayModal {
  constructor() {
    this.modalEl = document.querySelector(".day-start-modal");
    this.dayEl = document.querySelector(".day-start-modal .day");
    this.cashEl = document.querySelector(".day-start-modal .cash");
    this.cashErrorEl = document.querySelector(".day-start-modal .cash-error");
    this.overlayEl = document.querySelector(".overlay");

    this.berryInputEl = document.querySelector(".berry-slider");
    this.berryCountEl = document.querySelector(".berry-count");
    this.berryCostEl = document.querySelector(".berry-cost");

    this.icecreamCountEl = document.querySelector(".icecream-count");
    this.goBtn = document.querySelector(".day-start-modal button.go");

    this.icecreamCountErrorEl = document.querySelector(".icecream-count-error");
    this.icecreamPriceEl = document.querySelector(".icecream-price");
    this.icecreamPriceErrorEl = document.querySelector(".icecream-price-error");

    this.okButton = document.querySelector(".day-result-modal button");

    this.berryInputEl.addEventListener("input", (e) => {
      this.berryCountEl.textContent = e.target.value;
      const berryCost = e.target.value * BERRY_COST;
      this.berryCostEl.textContent = berryCost.toFixed(2);
      // calc new cash
      const cash = this.cash - this.getBerryCost() * this.getIceCreamCount();
      this.cashEl.textContent = cash.toFixed(2);
    });

    this.icecreamCountEl.addEventListener("input", (e) => {
      const cash = this.cash - this.getBerryCost() * e.target.value;
      this.cashEl.textContent = cash.toFixed(2);
    });

    this.soundBtn = document.querySelector(
      ".day-start-modal .sound-button button"
    );

    this.soundBtn.addEventListener("click", () => {
      Sound.toggleSound();
    });

    this.okButton.addEventListener("click", (e) => {
      engine.dayResultModal.closeDayResultModal();
      engine.nextDay();
    });

    this.goBtn.addEventListener("click", () => {
      if (!this.isValid()) {
        return;
      }

      // Valid, set values in engine
      engine.iceCreamCount = this.getIceCreamCount();
      // console.log(typeof this.dayModal.getIceCreamCount());
      engine.startIcecreamCount = this.getIceCreamCount();
      engine.cash = this.getCash();
      engine.startCash = this.getCash();
      engine.icecreamSalePrice = this.getIceCreamSalePrice();
      engine.icecreamCost = this.getBerryCost();

      Graphics.updateCashDisplay(this.cash);
      Graphics.updateDayDisplay(this.day);
      Graphics.updateIceCreamCount(this.iceCreamCount);
      Graphics.updateIceCreamSalePrice(this.icecreamSalePrice);
      Graphics.updateIceCreamCost(this.icecreamCost);
      this.closeModal();
      engine.runDay();
    });
  }

  openModal() {
    this.modalEl.classList.remove("hidden");
    this.overlayEl.classList.remove("hidden");
  }

  closeModal() {
    // console.log("close dayresult modal");
    this.modalEl.classList.add("hidden");
    this.overlayEl.classList.add("hidden");
  }

  setDay(day) {
    this.dayEl.textContent = day;
  }

  setCash(amount) {
    this.cash = amount;
    this.cashEl.textContent = amount.toFixed(2);
  }

  getCash() {
    return Number(this.cashEl.textContent);
  }

  getBerryCount() {
    return Number(this.berryCountEl.textContent);
  }

  getBerryCost() {
    return Number(this.berryCostEl.textContent);
  }

  getIceCreamCount() {
    return Number(this.icecreamCountEl.value);
  }

  getIceCreamSalePrice() {
    return Number(this.icecreamPriceEl.value);
  }

  updateSoundBtnText(text) {
    this.soundBtn.textContent = text;
  }

  isValid() {
    let isError = false;
    if (!this.icecreamCountEl.checkValidity()) {
      this.icecreamCountErrorEl.innerHTML =
        this.icecreamCountEl.validationMessage;
      isError = true;
    }
    if (!this.icecreamPriceEl.checkValidity()) {
      this.icecreamPriceErrorEl.innerHTML =
        this.icecreamPriceEl.validationMessage;
      isError = true;
    }

    // Check cash is positive
    const cash = Number(this.cashEl.textContent);
    if (cash < 0) {
      this.cashErrorEl.innerHTML =
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

class EndGameModal {
  constructor() {
    // money
    this.modalEl = document.querySelector(".end-game-modal");
    this.moneyEl = document.querySelector(".end-game-modal .cash");
    this.overlayEl = document.querySelector(".overlay");
    this.dayEl = document.querySelector(".end-game-modal .day");
  }

  setStats(cash, day) {
    this.moneyEl.textContent = cash.toFixed(2);
    this.dayEl.textContent = day;
  }

  open() {
    this.modalEl.classList.remove("hidden");
    this.overlayEl.classList.remove("hidden");
  }

  close() {}
}

class DayResultModal {
    constructor() {
    this.modalEl = document.querySelector(".day-result-modal");
    this.dayEl = document.querySelector(".day-result-modal .day");
    this.iceCreamSoldEl = document.querySelector(
      ".day-result-modal .icecream-sold"
    );
    this.iceCreamSalePriceEl = document.querySelector(".icecream-sale-price");
    this.revenueEl = document.querySelector(".revenue");
    this.cashEl = document.querySelector(".day-result-modal .cash");
    this.overlayEl = document.querySelector(".overlay");
  }

  setStats(day, iceCreamSold, iceCreamSalePrice, dayRevenue, cash) {
    console.log(
      `stats: day: ${day}, icecream: ${iceCreamSold}, dayRevenue: ${dayRevenue}, CASH: ${cash} `
    );
    this.dayEl.textContent = day;
    this.iceCreamSoldEl.textContent = iceCreamSold;
    this.iceCreamSalePriceEl.textContent = iceCreamSalePrice.toFixed(2);
    this.revenueEl.textContent = dayRevenue.toFixed(2);
    this.cashEl.textContent = cash.toFixed(2);
  }

  open() {
    this.modalEl.classList.remove("hidden");
    this.overlayEl.classList.remove("hidden");
    this.runAnimations();
  }

  runAnimations() {}

  closeDayResultModal() {
    this.modalEl.classList.add("hidden");
    this.overlayEl.classList.add("hidden");
  }
}

const Events = {
  init: function () {
    Graphics.soundBtn.addEventListener("click", () => {
      Sound.toggleSound();
    });
  },
};

const engine = new Engine();
engine.startGame();
