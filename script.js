"use strict";

let isSoundOn = false;

let soundGameStart;
let soundLoosePoint;
let soundGameOver;
let soundGameWin;
let soundError;

const modal = document.querySelector(".modal");
const modalEnd = document.querySelector(".modal-end");
const overlay = document.querySelector(".overlay");
const nextDayBtn = document.querySelector(".next-day");

// From: https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.classList.add("sound-point");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    if (isSoundOn) {
      this.sound.play();
    }
  };
  this.stop = function () {
    this.sound.pause();
  };
}

// https://freesound.org/people/vikuserro/sounds/265549/
// let backgroundMusic = new sound(
//   "audio/265549__vikuserro__cheap-flash-game-tune.mp3"
// );

const Engine = {
  money: 0,
  popcicles: 0,
  weather: 0,
  day: 0,
  isGameRunning: false,
  popcicleCost: 50,
  popsiclePrice: 0,
  popciclesMade: 0,
  popciclesSold: 0,

  startGame() {
    this.popcicles = 0;
    this.popciclesMade = 0;
    this.popciclesSold = 0;
    this.weather = [0, 1, 2];
    this.day = 0;
    this.money = 150;
    Graphics.updateDayDisplay(this.day);
    Graphics.updateMoneyDisplay(this.money, false);
    Graphics.showMoneyDisplay();

    this.popsiclePrice = 100;
    this.isGameRunning = true;
    if (isSoundOn) {
      document.getElementById("background-music").play();
    }

    Engine.nextDay();
  },

  endGame() {
    this.isGameRunning = false;
    document.getElementById("background-music").pause();
    startBtn.classList.remove("hidden");
  },

  addMoney(cost) {
    console.log(`addMoney: cost: ${cost}`);
    console.log(`addMoney: this.money1: ${this.money}`);
    this.money = this.money + cost;
    Graphics.updateMoneyDisplay(this.money);
  },

  calcDemand(weather, price) {
    let multiplier = weather * 0.1;
    let demand = (-0.6 + multiplier) * price + 100;
    console.log(
      `calcDemand: weather:${weather}, multiplier:${multiplier}, price:${price} = ${demand}`
    );
    return demand < 0 ? 0 : demand;
  },

  nextDay() {
    if (Engine.day === 7 || Engine.money <= 0) {
      Graphics.openEndModal();
      return;
    }

    priceEl.value = Engine.popsiclePrice;
    Graphics.resetGraphics();

    this.day++;
    Graphics.updateDayDisplay(this.day);
    Graphics.updatePopsicleCost(this.popcicleCost);
    Graphics.updatePopsicleStats(this.popsiclesMade, this.popsiclesSold);
    Graphics.openModal();
  },

  runDay() {
    Graphics.closeModal();

    // Determine supply
    let customers = Engine.calcDemand(0, this.popsiclePrice);
    // Cannot have more customers than you have popsicles.
    if (customers > this.popcicles) {
      customers = this.popcicles;
    }
    console.log(`customers: ${customers}`);
    Graphics.displayMessage(`Customers: 0`);
    for (let i = 0; i < customers; i++) {
      Engine.popciclesSold++;
      Graphics.buyPopsicle(i);
      setTimeout(() => {
        Graphics.displayMessage(`Customers: ${i + 1}`);
      }, 50 * i);
    }
    setTimeout(() => {
      nextDayBtn.classList.remove("hidden");
    }, 1000);
  },
};

const Graphics = {
  messageDisplayUntil: 0,
  messageDisplayTime: 5000,
  hideMessageTimer: null,

  resetGraphics() {
    // remove all popsicles and kids from last round
    let kidEls = document.querySelectorAll(".kid");
    for (let i = 0; i < kidEls.length; i++) {
      kidEls[i].remove();
    }

    let popsicleEls = document.querySelectorAll(".popsicle");
    for (let i = 0; i < popsicleEls.length; i++) {
      popsicleEls[i].remove();
    }

    let soundPoint = document.querySelectorAll(".sound-point");
    for (let i = 0; i < soundPoint.length; i++) {
      soundPoint[i].remove();
    }
  },

  updateSoundDisplay() {
    console.log(soundCtrl.textContent);
    if (isSoundOn) {
      soundCtrl.textContent = "Sound Off";
      document.getElementById("background-music").pause();
      isSoundOn = false;
    } else {
      document.getElementById("background-music").play();
      soundCtrl.textContent = "Sound On";
      isSoundOn = true;
    }
  },

  buyPopsicle(kidId) {
    //console.log("popscicle buy!");
    let kidEl = document.createElement("div");
    let popsicleEl = document.createElement("div");

    // Randomize kid
    let kidIcons = ["🧍🏻‍♀️", "🧍🏼‍♀️", "🧍🏽‍♀️", "🧍🏾‍♀️", "🧍🏿‍♀️", "🧍🏻‍♂️", "🧍🏼‍♂️", "🧍🏽‍♂️", "🧍🏾‍♂️", "🧍🏿‍♂️"];
    let kidIndex = Math.floor(Math.random() * 10);
    //console.log(`kidIndex: ${kidIndex}`);

    kidEl.textContent = kidIcons[kidIndex];
    kidIcons[kidIndex];
    kidEl.classList.add("big-emoji");
    kidEl.classList.add("kid");
    let bodyEl = document.querySelector("body");
    bodyEl.appendChild(kidEl);

    popsicleEl.textContent = "🍡";
    popsicleEl.classList.add("popsicle");

    let animationSpeed = 2000;
    kidEl.animate(
      [
        { transform: "translateX(0vw)" },
        { transform: "translateX(-80vw)" },
        { transform: "translateX(-86vw)" },
      ],
      {
        duration: animationSpeed,
        iterations: 2,
        direction: "alternate",
        delay: kidId * 30,
        easing: "ease-in-out",
        composite: "add",
      }
    );

    // update money
    setTimeout(() => {
      Engine.addMoney(Engine.popsiclePrice);
      bodyEl.appendChild(popsicleEl);

      popsicleEl.animate(
        [
          {
            opacity: 1,
            transform: "translate(0vw, 0vw)",
          },
          {
            opacity: 0,
            transform: "translate(35vw, -12vw)",
          },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );
    }, animationSpeed + kidId * 30);
  },

  displayMessage(message) {
    let messageEl = document.querySelector(".message");
    messageEl.textContent = message;

    const time = Date.now();
    if (this.messageDisplayUntil < time) {
      // Timer must have been done, show message
      messageEl.classList.remove("hidden");
    }
    // update message to display for 5 seconds in the future
    this.messageDisplayUntil = time + this.messageDisplayTime;

    messageEl.animate(
      [
        { backgroundColor: "rgba(0, 103, 238, 0.938)" },
        { backgroundColor: "rgb(2, 146, 230)" },
      ],
      {
        duration: 200,
        easing: "ease-in-out",
      }
    );

    // Create time to hide message in the future.
    if (!this.hideMessageTimer) {
      this.hideMessageTimer = setInterval(() => {
        const time = Date.now();
        if (this.messageDisplayUntil < time) {
          messageEl.classList.add("hidden");
          clearInterval(this.hideMessageTimer);
          this.hideMessageTimer = null;
        }
      }, 100);
      console.log("created Timer " + this.hideMessageTimer);
    }
  },

  openModal() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  },

  closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  },

  openEndModal() {
    modalEnd.classList.remove("hidden");
    overlay.classList.remove("hidden");
  },

  closeEndModal() {
    modalEnd.classList.add("hidden");
    overlay.classList.add("hidden");
  },

  showMoneyDisplay() {
    let moneyWrapperEls = document.querySelectorAll(".wrapper-money");
    for (let i = 0; i < moneyWrapperEls.length; i++) {
      moneyWrapperEls[i].classList.remove("hidden");
    }
  },

  updateMoneyDisplay(amount, flash = true) {
    let moneyEls = document.querySelectorAll(".money");
    for (let i = 0; i < moneyEls.length; i++) {
      moneyEls[i].textContent = amount;
      if (flash) {
        moneyEls[i].classList.add("rainbow-text");
        setTimeout(() => {
          moneyEls[i].classList.remove("rainbow-text");
        }, 3000);
      }
    }

    if (isSoundOn) {
      let soundAddPoint = new sound("audio/add-point.wav");
      soundAddPoint.play();
    }
  },

  updatePopsicleStats(popsciclesMade, popsciclesSold) {
    console.log(popsciclesMade + " " + popsciclesSold);
    popsiclesMadeEl.textContent = popsciclesMade;
    popsiclesSoldEl.textContent = popsciclesSold;
  },

  updateDayDisplay(day) {
    if (day === 1) {
      let dayWrapperEls = document.querySelectorAll(".wrapper-day");
      for (let i = 0; i < dayWrapperEls.length; i++) {
        dayWrapperEls[i].classList.remove("hidden");
      }
    }
    let dayEls = document.querySelectorAll(".day");
    for (let i = 0; i < dayEls.length; i++) {
      dayEls[i].textContent = day;
    }
  },
  updatePopsicleCost(cost) {
    let popcicleCostEl = document.querySelector(".popsicle-cost");
    popcicleCostEl.innerHTML = cost;
  },
};

let soundCtrl = document.querySelector(".sound");
let startBtn = document.querySelector(".start");

soundCtrl.addEventListener("click", (e) => {
  isSoundOn ? !isSoundOn : isSoundOn;
  Graphics.updateSoundDisplay();
});

startBtn.addEventListener("click", () => {
  if (!Engine.isGameRunning) {
    Engine.startGame();
  }
  startBtn.classList.add("hidden");
});

nextDayBtn.addEventListener("click", () => {
  nextDayBtn.classList.add("hidden");
  Engine.nextDay();
});

// Modal
let goBtn = document.querySelector(".go");
let moneyEstimationEl = document.querySelector(".money-estimation");
let priceEl = document.querySelector(".price");
let amountEl = document.querySelector(".amount");
let amountErrorEl = document.querySelector(".amount-error");
let priceErrorEl = document.querySelector(".price-error");
let popsiclesMadeEl = document.querySelector(".popsicles-made");
console.log(popsiclesMadeEl);
let popsiclesSoldEl = document.querySelector(".popsicles-sold");

goBtn.addEventListener("click", () => {
  let isError = false;
  if (!amountEl.checkValidity()) {
    amountErrorEl.innerHTML = amountEl.validationMessage;
    isError = true;
  }

  if (!priceEl.checkValidity()) {
    priceErrorEl = priceEl.validationMessage;
    isError = true;
  }

  if (isError) {
    return;
  } else {
    let errorEls = document.querySelectorAll(".error");
    for (let i = 0; i < errorEls.length; i++) {
      errorEls[i].innerHTML = "";
    }
  }

  // Valid
  Engine.popsiclePrice = Number(priceEl.value);
  Engine.popcicles = Number(amountEl.value);
  Engine.popciclesMade += Engine.popsicles;

  Engine.money = Engine.money - Engine.popcicles * Engine.popcicleCost;

  Graphics.updateMoneyDisplay(Engine.money);

  // Reset amount
  amountEl.value = "";
  Engine.runDay();
});

amountEl.addEventListener("input", (e) => {
  let amount = Number(amountEl.value);
  if (amount < 0) {
    amountErrorEl.innerHTML = "Amount must be larger than 0.";
  } else {
    amountErrorEl.innerHTML = "";
  }
  let estimatedMoney = Engine.money - amount * Engine.popcicleCost;
  if (estimatedMoney >= 0) {
    amountErrorEl.innerHTML = "";
    moneyEstimationEl.textContent = estimatedMoney;
    goBtn.classList.remove("hidden");
  } else {
    amountErrorEl.innerHTML = "You do not have enough money.";
    goBtn.classList.add("hidden");
  }
});

// End Modal
let okBtn = document.querySelector(".ok");

okBtn.addEventListener("click", () => {
  Graphics.closeEndModal();
  Engine.endGame();
});
