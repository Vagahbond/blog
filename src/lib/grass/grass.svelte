<script lang="ts">
	import { onMount } from 'svelte';
	import GrassBlade from './grassBlade.svelte';

	let growthCoefficient = $state(0);

	onMount(() => {
		setInterval(() => {
			if (growthCoefficient < 0.2) {
				growthCoefficient += 0.1;
			}
		}, 1000);
	});

	function randomBladeColor(rand: number) {
		const baseHue = 120; // green
		const hue = baseHue + (rand * 80 - 40);
		return {
			colorBase: `hsl(${hue}, 50%, 30%)`, // dark base
			colorMid: `hsl(${hue}, 50%, 35%)`, // mid
			colorTip: `hsl(${hue}, 45%, 60%)` // light tip
		};
	}
</script>

{#if growthCoefficient > 0.1}
	<div class="grass-field grass">
		{#each Array(90).fill(0) as _, i}
			{@const color = randomBladeColor(Math.random())}
			<GrassBlade onclick={() => console.log('yoo')} {color} growth={growthCoefficient} />
		{/each}
	</div>
{/if}

<style>
	.grass-field {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		/*pointer-events: none; */
		z-index: 100;
		display: flex;
	}
</style>
