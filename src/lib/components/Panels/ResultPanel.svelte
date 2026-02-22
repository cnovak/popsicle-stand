<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { gameStore } from "../../stores/game-store";

    export let dayStats: {
        iceCreamSold: number;
        revenue: number;
        profit: number;
        startingCash: number;
    };

    const dispatch = createEventDispatcher();

    function handleNextDay() {
        gameStore.nextDay();
        dispatch("nextday");
    }
</script>

<div class="result-panel">
    <div class="result-header">Day {$gameStore.currentDay} Done!</div>

    <div class="stats-grid">
        <div class="stat-row">
            <span>Sales:</span>
            <b>{dayStats.iceCreamSold} 🍦</b>
        </div>
        <div class="stat-row">
            <span>Revenue:</span>
            <b class="success">${dayStats.revenue.toFixed(2)}</b>
        </div>
        <div class="stat-row">
            <span>Profit:</span>
            <b
                class:success={dayStats.profit > 0}
                class:loss={dayStats.profit < 0}
            >
                ${dayStats.profit.toFixed(2)}
            </b>
        </div>
        <div class="stat-row">
            <span>Cash:</span>
            <b>${$gameStore.cash.toFixed(2)}</b>
        </div>
        <div class="stat-row">
            <span>Stock:</span>
            <b>{$gameStore.iceCreamCount} 🍦</b>
        </div>
    </div>

    <button class="button next-day rainbow-background" on:click={handleNextDay}>
        Next Day →
    </button>
</div>

<style>
    .result-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .result-header {
        font-size: 1.6rem;
        text-align: center;
    }

    .stats-grid {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        background: #f0f4f8;
        border-radius: 4px;
        padding: 1rem;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        padding-bottom: 0.4rem;
        border-bottom: 1px dashed #ddd;
    }

    .stat-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .success {
        color: green;
    }

    .loss {
        color: red;
    }

    .next-day {
        width: 100%;
        font-size: 1.6rem;
        padding: 1.2rem;
    }
</style>
