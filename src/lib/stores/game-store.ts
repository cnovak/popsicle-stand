import { writable } from "svelte/store";
import { WeatherType, type GameState } from "../logic/types";
import { generateRandomWeather } from "../logic/weather";
import { calcProductionCost } from "../logic/game-logic";

const initialState: GameState = {
    cash: 5.0,
    iceCreamCount: 0,
    currentDay: 0,
    weather: WeatherType.Sunny,
    berriesPerIceCream: 10,
    iceCreamSalePrice: 1.0,
    playerName: "Player 1",
};

function createGameStore() {
    const { subscribe, set, update } = writable<GameState>(initialState);

    return {
        subscribe,
        init: (playerName: string) => {
            set({ ...initialState, playerName, currentDay: 1 });
        },
        startDay: (productionCount: number, price: number, berries: number) => {
            update((state) => {
                const cost = calcProductionCost(productionCount, berries);
                return {
                    ...state,
                    iceCreamCount: state.iceCreamCount + productionCount,
                    iceCreamSalePrice: price,
                    berriesPerIceCream: berries,
                    cash: state.cash - cost,
                };
            });
        },
        sellIceCream: (count: number) => {
            update((state) => ({
                ...state,
                iceCreamCount: Math.max(0, state.iceCreamCount - count),
                cash: state.cash + count * state.iceCreamSalePrice,
            }));
        },
        nextDay: () => {
            update((state) => ({
                ...state,
                currentDay: state.currentDay + 1,
                weather: generateRandomWeather(),
            }));
        },
        reset: () => set(initialState),
    };
}

export const gameStore = createGameStore();
