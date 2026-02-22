import {
  animationFrameScheduler,
  fromEvent,
  interval,
  map,
  Observable,
  scan,
  Scheduler,
  share,
  throttleTime,
  timer,
  withLatestFrom,
} from "rxjs";
import { Engine } from "./engine";

const engine = new Engine();
engine.run();

// const ticker$ = interval(0, Scheduler.AnimationFrame)
//     .map(() => ({
//         time: Date.now(),
//         deltaTime: null
//     }))
//     .scan(
//         (previous, current) => ({
//             time: current.time,
//             deltaTime: (current.time - previous.time) / 1000
//         })
//     );

// const clicks = fromEvent(document, 'click');
// const timer = interval(1000);
// const result = clicks.pipe(withLatestFrom(timer));
// result.subscribe(x => console.log(x));

// const loop$ = timer(0, 1000 / 60, animationFrameScheduler).pipe(
//     scan<any, { time: number; delta: number }>(
//     (previous) => {
//         // console.log('hi');
//         const time = performance.now();
//         return { time, delta: time - previous.time };
//     },
//     { time: performance.now(), delta: 0 }
//     ),
//     share()
// );

// loop$.subscribe((e) => 
// {
//     console.log(e);
// });


// const t = new Loop();
// t.loop$.subscribe((x) => {
//     console.log(`Time: ${x.time} Delta: ${x.delta}`);
// })

// const numbers$ = interval(1000);
// numbers$.pipe((n) => {
//     console.log(n);

// });

// fromEvent(document, 'click').subscribe(() => console.log('Clicked!'));

// document.addEventListener('click', () => console.log(`Clicked ${++count} times`));
// fromEvent(document,'click').pipe(scan(count => count + 1, 0))
// .subscribe((e) => {
//     console.log(e)
// });

// fromEvent<MouseEvent>(document, 'click')
//   .pipe(
//     throttleTime(1000),
//     map(event => event.clientX),
//     scan((count, clientX) => count + clientX, 0)
//   )
//   .subscribe(count => console.log(count));

// const observable = new Observable((subscriber) => {
//   subscriber.next(1);
//   subscriber.next(2);
//   subscriber.next(3);
//   setTimeout(() => {
//     subscriber.next(4);
//     subscriber.complete();
//   }, 1000);
// });

// console.log("just before subscribe");
// observable.subscribe({
//   next(x) {
//     console.log("got value " + x);
//   },
//   error(err) {
//     console.error("something wrong occurred: " + err);
//   },
//   complete() {
//     console.log("done");
//   },
// });
// console.log("just after subscribe");
