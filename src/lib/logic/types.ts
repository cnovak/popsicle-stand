export enum WeatherType {
  Sunny = "Sunny",
  Rainy = "Rainy",
  Thunderstorms = "Thunderstorms",
}

export interface GameState {
  cash: number;
  iceCreamCount: number;
  currentDay: number;
  weather: WeatherType;
  berriesPerIceCream: number;
  iceCreamSalePrice: number;
  playerName: string;
}
