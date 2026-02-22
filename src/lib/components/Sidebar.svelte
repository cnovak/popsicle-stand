<script lang="ts">
  import { gameStore } from "../stores/game-store";
  import PrepPanel from "./Panels/PrepPanel.svelte";
  import SimPanel from "./Panels/SimPanel.svelte";
  import ResultPanel from "./Panels/ResultPanel.svelte";

  export let gameState: "PREP" | "SIMULATING" | "RESULT";
  export let soldSoFar: number = 0;
  export let totalExpected: number = 0;
  export let dayStats: {
    iceCreamSold: number;
    revenue: number;
    profit: number;
    startingCash: number;
  } = { iceCreamSold: 0, revenue: 0, profit: 0, startingCash: 0 };

  const weatherIcons: Record<string, string> = {
    Sunny: "☀️",
    Rainy: "🌧️",
    Thunderstorms: "⛈️",
  };

  $: weatherIcon = weatherIcons[$gameStore.weather] || "🌤️";
</script>

<aside class="sidebar">
  <div class="stats-section">
    <div class="stat-item">
      <span class="stat-label">Day</span>
      <span class="stat-value day">{$gameStore.currentDay}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Cash</span>
      <span class="stat-value money">${$gameStore.cash.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Stock</span>
      <span class="stat-value">🍦 x{$gameStore.iceCreamCount}</span>
    </div>
  </div>

  <div class="weather-strip">
    <span class="weather-icon">{weatherIcon}</span>
    <span class="weather-label">{$gameStore.weather}</span>
  </div>

  <div class="divider"></div>

  <div class="phase-panel">
    {#if gameState === "PREP"}
      <PrepPanel on:go />
    {:else if gameState === "SIMULATING"}
      <SimPanel {soldSoFar} {totalExpected} />
    {:else if gameState === "RESULT"}
      <ResultPanel {dayStats} on:nextday />
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    width: 300px;
    background: #f4fafd;
    border-right: 3px solid #e8f0f6;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  @media (max-width: 900px) {
    .sidebar {
      width: auto;
      border-right: none;
      border-top: 3px solid #e8f0f6;
      max-height: 40vh;
    }
  }

  .stats-section {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 1.4rem;
  }

  .stat-label {
    color: #888;
    font-size: 1.1rem;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .stat-value.day {
    color: rgb(2, 146, 230);
  }

  .stat-value.money {
    color: #2a9d2a;
  }

  .weather-strip {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem;
    background: #e8f4fd;
    border-radius: 6px;
    font-size: 1.3rem;
  }

  .weather-icon {
    font-size: 2.4rem;
  }

  .weather-label {
    font-size: 1.3rem;
  }

  .divider {
    height: 1px;
    background: #dde8f0;
  }

  .phase-panel {
    flex: 1;
  }
</style>
