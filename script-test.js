"use strict";
const kidQueue = [];

function generateTraffic(count) {
  let kidPromises = [];
  console.log("Gentraffid1");
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 1000;

    const p = new Promise((resolve) => {
      setTimeout(() => {
        const kid = new Kid(i);
        const el = document.querySelector(".weather");
        kid.el = el;
        console.log("going to stand");
        goToStand(kid).then(() => {
          console.log("kid done:" + Date.now);
          resolve();
        });
      }, delay);
    });
    kidPromises.push(p);
  }
  console.log(kidPromises);
  return Promise.all(kidPromises);
}

function leaveStand(kid) {
  const kidEl = kid.el;
  console.log("leaving stand");

  console.log("leaving stand: " + Date.now());
  const animation = kidEl.animate(
    [
      { transform: "translateX(" + 33 + "px)" },
      { transform: "translateX(" + 44 + "px)" },
    ],
    {
      duration: 1000,
      easing: "ease-out",
      fill: "forwards",
    }
  );
  return animation.finished;
}

function goToStand(kid) {
  kidQueue.push(kid);

  return kid.el
    .animate(
      [{ transform: "translate(0)" }, { transform: "translate(" + 30 + "px)" }],
      {
        duration: 1000,
        easing: "ease-out",
        fill: "forwards",
      }
    )
    .finished.then(() => {
      console.log("goto stand finsihed: " + Date.now());
      // remove a kid from the queue
      console.log("queue length:" + kidQueue.length);
      if (kidQueue.length > 0) {
        const kidLeave = kidQueue.shift();
        return leaveStand(kidLeave);
      }
    });
}

const Kid = function (id) {
  this.id = id;
};

generateTraffic(1);
