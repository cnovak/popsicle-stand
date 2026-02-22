import { WeatherType } from "./types";
import { getDemandChange } from "./weather";

export const BERRY_COST = 0.05;

export function calcDemand(
    price: number,
    berriesPerIceCream: number,
    weather: WeatherType
): number {
    // Original logic:
    // let demand = 60 - 15.5 * price + (berriesPerIceCream - 5) + demandChange;
    const demandChange = getDemandChange(weather);
    const demand = 60 - 15.5 * price + (berriesPerIceCream - 5) + demandChange;

    return demand <= 0 ? 1 : Math.floor(demand);
}

export function calcProductionCost(
    count: number,
    berriesPerIceCream: number
): number {
    return count * (berriesPerIceCream * BERRY_COST);
}
