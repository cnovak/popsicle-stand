import { WeatherEngine } from "./weather-engine";

export abstract class Weather {
  constructor(protected engine: WeatherEngine) {}

   getName() {
    return this.constructor.name;

  }

  abstract start(): void;
  abstract stop(): void;
  abstract getDemandChange(): number;
}
