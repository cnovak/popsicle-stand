import { WeatherType } from "./types";

export function getDemandChange(type: WeatherType): number {
    switch (type) {
        case WeatherType.Sunny:
            return 0;
        case WeatherType.Rainy:
            return -20;
        case WeatherType.Thunderstorms:
            return -40;
        default:
            return 0;
    }
}

export function generateRandomWeather(): WeatherType {
    const r = Math.random() * 100;
    if (r <= 5) return WeatherType.Thunderstorms;
    if (r <= 30) return WeatherType.Rainy;
    return WeatherType.Sunny;
}
