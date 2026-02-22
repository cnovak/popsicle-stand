<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { gameStore } from "../../stores/game-store";
    import { BERRY_COST, calcProductionCost } from "../../logic/game-logic";

    const dispatch = createEventDispatcher();

    let productionCount = 0;
    let price = 1.0;
    let berries = $gameStore.berriesPerIceCream;

    $: cost = calcProductionCost(productionCount, berries);
    $: futureCash = $gameStore.cash - cost;
    $: isValid = futureCash >= 0 && productionCount >= 0 && price > 0;

    function handleGo() {
        if (!isValid) return;
        gameStore.startDay(productionCount, price, berries);
        dispatch("go", { cost });
    }
</script>

<div class="prep-panel">
    <form on:submit|preventDefault={handleGo}>
        <div class="input-group">
            <label for="productionCount">How many?</label>
            <div class="input-row">
                <input
                    id="productionCount"
                    type="number"
                    bind:value={productionCount}
                    min="0"
                    required
                />
                <span>🍦</span>
            </div>
        </div>

        <div class="input-group">
            <label for="berries">Berries each:</label>
            <input
                id="berries"
                type="range"
                bind:value={berries}
                min="1"
                max="20"
                class="slider"
            />
            <div class="range-info">
                <span>{berries} 🍓</span>
                <span class="cost-info"
                    >${(berries * BERRY_COST).toFixed(2)}/ea</span
                >
            </div>
        </div>

        <div class="input-group">
            <label for="price">Sell price:</label>
            <div class="input-row">
                <span>$</span>
                <input
                    id="price"
                    type="number"
                    bind:value={price}
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>
        </div>

        <div class="cash-summary" class:error={futureCash < 0}>
            <div class="summary-row">
                <span>Cost:</span>
                <span>${cost.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>After:</span>
                <span>${futureCash.toFixed(2)}</span>
            </div>
            {#if futureCash < 0}
                <div class="error-text">🚫 Not enough!</div>
            {/if}
        </div>

        <button class="button go rainbow-background" disabled={!isValid}>
            Go!
        </button>
    </form>
</div>

<style>
    .prep-panel {
        display: flex;
        flex-direction: column;
    }

    .input-group {
        margin-bottom: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .input-group label {
        font-size: 1.1rem;
        color: #666;
    }

    .input-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .input-group input[type="number"] {
        width: 80px;
        padding: 0.4rem;
        font-size: 1.6rem;
        font-family: inherit;
    }

    .slider {
        width: 100%;
        margin: 0.3rem 0;
    }

    .range-info {
        display: flex;
        justify-content: space-between;
        font-size: 1.1rem;
    }

    .cost-info {
        color: #888;
    }

    .cash-summary {
        padding: 1rem;
        background: #f0f4f8;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.3rem;
    }

    .cash-summary.error {
        border: 2px solid red;
    }

    .error-text {
        color: red;
        font-size: 1.1rem;
        margin-top: 0.3rem;
    }

    .go {
        width: 100%;
        font-size: 1.6rem;
        padding: 1.2rem;
    }

    button:disabled {
        filter: grayscale(1);
        cursor: not-allowed;
    }
</style>
