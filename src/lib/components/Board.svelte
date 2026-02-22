<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { gameStore } from "../stores/game-store";
  import { calcDemand } from "../logic/game-logic";

  const dispatch = createEventDispatcher();

  export let isRunning = false;

  let customers: Array<{ id: number; icon: string }> = [];
  let isVanAtStand = false;

  const icons = ["🧍🏻‍♀️", "🧍🏼‍♀️", "🧍🏽‍♀️", "🧍🏾‍♀️", "🧍🏿‍♀️", "🧍🏻‍♂️", "🧍🏼‍♂️", "🧍🏽‍♂️", "🧍🏾‍♂️", "🧍🏿‍♂️"];

  const weatherIcons: Record<string, string> = {
    Sunny: "☀️",
    Rainy: "🌧️",
    Thunderstorms: "⛈️",
  };

  const skyColors: Record<string, string> = {
    Sunny: "#87CEEB",
    Rainy: "#a0b0bc",
    Thunderstorms: "#5a6a72",
  };

  $: skyColor = skyColors[$gameStore.weather] || "#87CEEB";
  $: weatherIcon = weatherIcons[$gameStore.weather] || "🌤️";

  async function runSimulation() {
    isVanAtStand = true;

    const demand = calcDemand(
      $gameStore.iceCreamSalePrice,
      $gameStore.berriesPerIceCream,
      $gameStore.weather,
    );

    const totalCustomers = Math.min(demand, $gameStore.iceCreamCount);

    for (let i = 0; i < totalCustomers; i++) {
      const customer = {
        id: i,
        icon: icons[Math.floor(Math.random() * icons.length)],
      };
      customers = [...customers, customer];

      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1000));

      gameStore.sellIceCream(1);
      dispatch("sale");

      customers = customers.filter((c) => c.id !== customer.id);
    }

    await new Promise((r) => setTimeout(r, 1000));
    isVanAtStand = false;
    dispatch("finished", {
      iceCreamSold: totalCustomers,
    });
  }

  $: if (isRunning) {
    runSimulation();
  }
</script>

<div
  class="board-wrapper"
  style="background: {skyColor}; transition: background 1s;"
>
  <div class="weather-overlay">
    <span class="weather-emoji">{weatherIcon}</span>
  </div>

  <div class="ground"></div>

  <div class="van" class:at-stand={isVanAtStand}>
    <div class="sign">🍦 ${$gameStore.iceCreamSalePrice.toFixed(2)} 🍦</div>
    <div class="icon">🚌</div>
  </div>

  <div class="customers">
    {#each customers as customer (customer.id)}
      <div
        class="customer"
        in:fly={{ x: 100, duration: 2000 }}
        out:fly={{ x: -100, duration: 2000 }}
      >
        {customer.icon}
      </div>
    {/each}
  </div>
</div>

<style>
  .board-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .weather-overlay {
    position: absolute;
    top: 1.5rem;
    right: 2rem;
    font-size: 5rem;
    z-index: 4;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .ground {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 35%;
    background: burlywood;
  }

  .van {
    position: absolute;
    bottom: 25%;
    left: 100%;
    transition: left 1s ease-out;
    z-index: 5;
  }

  .van.at-stand {
    left: 10%;
  }

  .van .icon {
    font-size: 6rem;
  }

  .sign {
    background: #ff5100;
    color: white;
    padding: 2px 10px;
    font-size: 1.5rem;
    position: absolute;
    top: -20px;
    white-space: nowrap;
  }

  .customers {
    position: absolute;
    bottom: 25%;
    left: 35%;
    display: flex;
    gap: 0.5rem;
    z-index: 6;
  }

  .customer {
    font-size: 4rem;
  }
</style>
