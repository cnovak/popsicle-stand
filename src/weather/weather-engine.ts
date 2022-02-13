import { Game } from "../game";
import { Rainy } from "./rainy";
import { Sunny } from "./sunny";
import { Thunderstorms } from "./thunderstorms";
import { Weather } from "./weather";

export class WeatherEngine {
  weatherStack:Weather[] = [];

  constructor(public game: Game) {
    console.log("weather init:", this.weatherStack);
  }

  incrementDay() {
    this.weatherStack.unshift(this.generateNewWeather());
  }

  getCurrentWeather(): Weather {
    return this.weatherStack[0];
  }

  startWeather() {
    this.weatherStack[0].start();
  }

  stopWeather() {
    this.weatherStack[0].stop();
  }

  private generateNewWeather(): Weather {
    return new Thunderstorms(this);
    // // random weather event
    // const weatherPercent = Math.floor(Math.random() * 100) + 1;
    // if(weatherPercent <= 30) {
    //   if(weatherPercent <= 5) {
    //     return new Thunderstorms(this);
    //   } else {
    //     return new Rainy(this);
    //   }
    // } else {
    //   return new Sunny(this);
    // }
  }
}
