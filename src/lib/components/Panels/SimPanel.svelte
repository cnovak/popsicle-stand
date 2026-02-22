<script lang="ts">
    import { gameStore } from "../../stores/game-store";

    export let soldSoFar: number = 0;
    export let totalExpected: number = 0;

    $: revenueSoFar = soldSoFar * $gameStore.iceCreamSalePrice;
</script>

<div class="sim-panel">
    <div class="sim-header">Selling...</div>

    <div class="live-stats">
        <div class="stat-row">
            <span>Sold:</span>
            <span class="stat-value">{soldSoFar} 🍦</span>
        </div>
        <div class="stat-row">
            <span>Revenue:</span>
            <span class="stat-value success">${revenueSoFar.toFixed(2)}</span>
        </div>
    </div>

    <div class="progress-bar">
        <div
            class="progress-fill"
            style="width: {totalExpected > 0
                ? (soldSoFar / totalExpected) * 100
                : 0}%"
        ></div>
    </div>

    <button class="button selling-btn" disabled> 🍦 Selling... </button>
</div>

<style>
    .sim-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .sim-header {
        font-size: 1.6rem;
        text-align: center;
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .live-stats {
        background: #f0f4f8;
        border-radius: 4px;
        padding: 1rem;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
    }

    .stat-row:last-child {
        margin-bottom: 0;
    }

    .stat-value {
        font-weight: bold;
    }

    .success {
        color: green;
    }

    .progress-bar {
        height: 0.8rem;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(to right, #ff9a9e, #a1c4fd);
        transition: width 0.3s ease;
        border-radius: 4px;
    }

    .selling-btn {
        width: 100%;
        font-size: 1.4rem;
        padding: 1rem;
        filter: grayscale(0.5);
        cursor: wait;
    }
</style>
