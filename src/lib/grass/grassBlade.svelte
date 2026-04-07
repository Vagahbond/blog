<script lang="ts">
	import { GrassBlade } from './grass';

	const { growth, color } = $props();

	const blade = $derived(new GrassBlade(growth));


</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={`${growth * 90}vh`}
	viewBox="0 0 30 200"
	style:left={`${Math.random() * 100}%`}
>
	<defs>
		<linearGradient id="grassGradient" x1="0" y1="1" x2="0" y2="0">
			<stop offset="0%" stop-color={color.colorBase} />
			<stop offset="40%" stop-color={color.colorMid} />
			<stop offset="100%" stop-color={color.colorTip} />
		</linearGradient>
	</defs>

	<!-- Grass blade -->
	<path d={blade.getPath()} fill="url(#grassGradient)" stroke="#4caf50" stroke-width="0">
		<animate
			attributeName="d"
			dur="10s"
			repeatCount="indefinite"
			calcMode="spline"
			keySplines="0.65 0 0.45 1; 0.35 0 0.75 1"
			values={`
        ${blade.getPath()};
        ${blade.getSwayedPath('right')};
        ${blade.getPath()}
`}
		/>
	</path>
</svg>

<style>
	svg {
		all: unset;
		position: absolute;
		bottom: 0;
		cursor: crosshair;
	}
</style>
