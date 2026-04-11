<script lang="ts">
	import { onMount } from 'svelte';

	let { blade, onclick } = $props();
</script>

<button class="blade-container" style:left={`${blade.offset * 100}%`} {onclick}>
	<svg xmlns="http://www.w3.org/2000/svg" height={`${blade.age * 90}vh`} viewBox="0 0 30 200">
		<defs>
			<linearGradient id={`grass-gradient-${blade.id}`} x1="0" y1="1" x2="0" y2="0">
				<stop offset="0%" stop-color={blade.color.colorBase} />
				<stop offset="40%" stop-color={blade.color.colorMid} />
				<stop offset="100%" stop-color={blade.color.colorTip} />
			</linearGradient>
		</defs>

		<!-- Grass blade -->
		<path
			d={blade.getPath()}
			fill={`url(#grass-gradient-${blade.id})`}
			stroke="black"
			stroke-width=".5"
		>
			<animate
				attributeName="d"
				dur="15s"
				repeatCount="indefinite"
				calcMode="spline"
				keySplines="0.55 0 0.45 1; 0.35 0 0.75 1;0.35 0 0.85 1; 0.25 0 0.95 1"
				values={`
          ${blade.getPath()};
          ${blade.getSwayedPath('right')};
          ${blade.getSwayedPath('left')};
          ${blade.getSwayedPath('right')};
          ${blade.getPath()}
        `}
			/>
		</path>
	</svg>
</button>

<style>
	.blade-container {
		position: absolute;
		bottom: 0;
		background: transparent;
		margin: 0;
		padding: 0;
		width: min-content;
		height: min-content;
		display: block;
		border: none;
	}

	svg {
		all: unset;
		cursor:
			url('/cursor/scissors_64.png') 32 32,
			auto;
		z-index: 200;
	}
</style>
