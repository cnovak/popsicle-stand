<script lang="ts">
  import Header from "./lib/components/Header.svelte";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import Board from "./lib/components/Board.svelte";
  import { gameStore } from "./lib/stores/game-store";
  import "./app.css";

  let gameState: "PREP" | "SIMULATING" | "RESULT" = "PREP";

  let currentDayStats = {
    iceCreamSold: 0,
    revenue: 0,
    profit: 0,
    startingCash: 0,
  };

  let soldSoFar = 0;
  let totalExpected = 0;
  let lastProductionCost = 0;

  function onStartDay(event: CustomEvent<{ cost: number }>) {
    lastProductionCost = event.detail.cost;
    soldSoFar = 0;
    totalExpected = $gameStore.iceCreamCount;
    gameState = "SIMULATING";
  }

  function onSale() {
    soldSoFar += 1;
  }

  function onSimulationFinished(event: CustomEvent<{ iceCreamSold: number }>) {
    const sold = event.detail.iceCreamSold;
    const revenue = sold * $gameStore.iceCreamSalePrice;

    currentDayStats = {
      ...currentDayStats,
      iceCreamSold: sold,
      revenue: revenue,
      profit: revenue - lastProductionCost,
    };

    gameState = "RESULT";
  }

  function onNextDay() {
    gameState = "PREP";
  }
</script>

<div class="app-container">
  <Header />

  <div class="game-layout">
    <Sidebar
      {gameState}
      {soldSoFar}
      {totalExpected}
      dayStats={currentDayStats}
      on:go={onStartDay}
      on:nextday={onNextDay}
    />
    <main class="board-area">
      <Board
        isRunning={gameState === "SIMULATING"}
        on:finished={onSimulationFinished}
        on:sale={onSale}
      />
    </main>
  </div>

  <footer class="footer">Hi Kaitlyn, Anna, and Jack! 👋🏻</footer>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
  }

  .game-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: row;
  }

  @media (max-width: 900px) {
    .game-layout {
      flex-direction: column-reverse;
    }

    .board-area {
      height: 60vh;
      flex: none;
    }
  }

  .board-area {
    flex: 2;
    position: relative;
  }

  .footer {
    background: #f4fafd;
    border-top: 5px solid white;
    padding: 1rem;
    text-align: center;
    font-size: 1.2rem;
    z-index: 10;
  }
</style>
