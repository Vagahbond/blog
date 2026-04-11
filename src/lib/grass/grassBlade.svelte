<script lang="ts">
	let { initialCut = false, blade, onclick } = $props();

	let nowCut = $state(false);

	let cut = $derived(nowCut || initialCut);

	function onBladeCLicked() {
		onclick();
		/*if (cut) {
			return;
		}

		cut = true;

		setTimeout(() => {}, 1000); */
	}
</script>

<button class={`blade-container  `} style:left={`${blade.offset * 95}%`}>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<svg
		class={cut ? 'cut' : ''}
		onclick={onBladeCLicked}
		xmlns="http://www.w3.org/2000/svg"
		height={`${blade.age * 90}vh`}
		viewBox="0 0 30 200"
	>
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
	@keyframes blade-tip-and-fall {
		0% {
			transform: translateY(0);
		}

		5% {
			transform: translateY(5%) translateX(-5px) rotate(-30deg);
		}

		100% {
			transform: translateY(100%) rotate(-120deg);
		}
	}

	.cut {
		animation: blade-tip-and-fall 2s ease-out forwards;
	}

	.blade-container {
		position: absolute;
		bottom: -1em;
		background: transparent;
		margin: 0;
		padding: 0;
		display: block;
		border: none;
		padding: 0;
		margin: 0;
	}

	.cut svg {
		pointer-events: none;
	}

	svg {
		all: unset;
		cursor:
			url('/cursor/scissors_64.png') 24 32,
			auto;
		padding: 0;
		margin: 0;
		position: relative;
	}
</style>
