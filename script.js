"use strict";

let isSoundOn = false;

let soundGameStart;
let soundLoosePoint;
let soundGameOver;
let soundGameWin;
let soundError;

const modal = document.querySelector(".modal");
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
  popcicles: [],
  weather: 0,
  day: 1,
  isGameRunning: false,
  popcicleCost: 50,

  startGame() {
    this.money = 0;
    this.popcicles = 0;
    this.weather = [0, 1, 2];
    this.day = 1;
    this.isGameRunning = true;
    if (isSoundOn) {
      document.getElementById("background-music").play();
    }
    //Graphics.updateDayDisplay(this.day);
    Graphics.updateMoneyDisplay(this.money, false);
    Engine.nextDayDecisions();
  },

  endGame() {
    this.isGameRunning = false;
    document.getElementById("background-music").pause();
    startBtn.classList.remove("hidden");
  },

  addMoney() {
    let amount = 10;
    // console.log(`addMoney: amount: ${amount}`);
    // console.log(`addMoney: this.money1: ${this.money}`);
    this.money = this.money + amount;
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

  nextDayDecisions() {
    priceCtl.value = 100;
    Graphics.openModal();
  },

  runDay(price) {
    // Graphics.buyPopsicle();
    Graphics.closeModal();

    // Determine supply
    let customers = Engine.calcDemand(0, price);
    //Graphics.displayMessage(`Customers: ${customers}`);
    console.log(`customers: ${customers}`);
    Graphics.displayMessage(`Customers: 0`);
    for (let i = 0; i < customers; i++) {
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

    // kidEl.animate([{ opacity: [0, 1] }], { delay: kidId * 500, duration: 500 });
    kidEl.animate(
      [
        { transform: "translateX(0vw)" },
        { transform: "translateX(-80vw)" },
        { transform: "translateX(-86vw)" },
      ],
      {
        duration: 1000,
        iterations: 2,
        direction: "alternate",
        delay: kidId * 30,
        easing: "ease-in-out",
        composite: "add",
      }
    );

    // update money
    setTimeout(() => {
      Engine.addMoney();
    }, 1000 + kidId * 30);
  },

  displayMessage(message, flash = true) {
    let messageEl = document.querySelector(".message");
    messageEl.classList.remove("hidden");
    messageEl.textContent = message;
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
    setTimeout(() => messageEl.classList.add("hidden"), 5000);
  },

  openModal() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  },

  closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  },

  updateMoneyDisplay(amount, playSound = true) {
    let moneyEl = document.querySelector(".money");
    moneyEl.textContent = amount;

    if (playSound) {
      let soundAddPoint = new sound("audio/add-point.wav");
      soundAddPoint.play();
    }

    moneyEl.classList.add("rainbow-text");
    setTimeout(() => {
      moneyEl.classList.remove("rainbow-text");
    }, 3000);
  },

  updateDayDisplay(day) {
    let dayEls = document.querySelectorAll(".day");
    for (let i = 0; i < dayEls.length; i++) {
      dayEls[i].textContent = day;
    }
  },
};

let soundCtrl = document.querySelector(".sound");
let startBtn = document.querySelector(".start");
let goBtn = document.querySelector(".go");
let priceCtl = document.querySelector(".price");
let amountCtl = document.querySelector(".amount");

soundCtrl.addEventListener("click", (e) => {
  isSoundOn ? !isSoundOn : isSoundOn;
  Graphics.updateSoundDisplay();
});

startBtn.addEventListener("click", () => {
  // Graphics.buyPopsicle();
  console.log("isGameRunning:" + Engine.isGameRunning);
  if (!Engine.isGameRunning) {
    Engine.startGame();
  }
  startBtn.classList.add("hidden");
});

goBtn.addEventListener("click", () => {
  let price = priceCtl.value;
  //let amount = amountCtl.value;
  console.log(`price: ${price}`);
  // console.log(`amount: ${amount}`);

  Engine.runDay(price);
});

nextDayBtn.addEventListener("click", () => {
  Engine.endGame();
  nextDayBtn.classList.add("hidden");
});

// let kidEl = document
//   .querySelector(".kid")
//   .animate(
//     [
//       { transform: "translateX(0vw)" },
//       { transform: "translateX(-25vw)" },
//       { transform: "translateX(-25vw)" },
//     ],
//     {
//       duration: 350,
//       iterations: "100",
//       direction: "alternate",
//       delay: 0,
//     }
//   );
