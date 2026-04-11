<script lang="ts">
	import { onMount } from 'svelte';
	import { GrassBlade } from './grass';
	import { PUBLIC_GRASS_SERVER_URL } from '$env/static/public';
	import GrassBladeComp from './grassBlade.svelte';
	import { bladeToBuffer, bufferToLawn } from './ws';

	let blades = $state<GrassBlade[]>([]);
	let cutBlades = $state<GrassBlade[]>([]);

	function setBlades(lawn: GrassBlade[]) {
		cutBlades = blades.filter((b) => !lawn.find((l) => l.id === b.id));
		blades = lawn;
	}

	let socket: WebSocket | undefined;

	onMount(() => {
		socket = new WebSocket((PUBLIC_GRASS_SERVER_URL as string) ?? 'ws://localhost:3012');

		socket.addEventListener('open', (event) => {
			console.log('Connected to the grass server');
		});

		socket.addEventListener('message', async (event) => {
			bufferToLawn(event.data).then((l) => setBlades(l));
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

	function onBladeCLicked(blade: GrassBlade) {
		const buffer = bladeToBuffer(blade);
		if (socket) {
			socket.send(buffer);
		}
	}
</script>

<div class="grass-field grass">
	{#each blades as blade (blade.id)}
		<GrassBladeComp onclick={() => onBladeCLicked(blade)} {blade} />
	{/each}
	{#each cutBlades as blade (blade.id)}
		<GrassBladeComp initialCut={true} onclick={() => {}} {blade} />
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
