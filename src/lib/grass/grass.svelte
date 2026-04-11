<script lang="ts">
	import { onMount } from 'svelte';
	import { bladeToBuffer, bufferToLawn, GrassBlade } from './grass';
	import GrassBladeComp from './grassBlade.svelte';

	let blades = $state<GrassBlade[]>([]);

	function setBlades(lawn: GrassBlade[]) {
		blades = lawn;
	}

	let socket: WebSocket | undefined;

	onMount(() => {
		socket = new WebSocket('ws://localhost:3012');

		socket.addEventListener('open', (event) => {
			console.log('Connected to the grass server');
		});

		socket.addEventListener('message', async (event) => {
			let lawn: GrassBlade[] = [];
			try {
				lawn = await bufferToLawn(event.data);
			} catch (e) {
				console.error(e);
			}
			setBlades(lawn);
		});

		// Handle errors
		socket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
		});

		// Connection closed
		socket.addEventListener('close', (event) => {
			console.log('Disconnected from the server');
		});
	});

	function onBladeCLicked(blade: GrassBlade, index: number) {
		if (socket) {
			const buffer = bladeToBuffer(blade);
			socket.send(bladeToBuffer(blade));
		}
	}
</script>

<div class="grass-field grass">
	{#each blades as blade, i (i)}
		<GrassBladeComp onclick={() => onBladeCLicked(blade, i)} {blade} />
	{/each}
</div>

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
