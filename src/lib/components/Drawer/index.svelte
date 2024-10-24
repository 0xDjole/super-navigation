<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';

	interface Props {
		open?: boolean;
		animate?: boolean;
		duration?: number;
		placement?: string;
		size?: any;
		zIndex?: any;
		height?: any;
		width?: any;
		left?: any;
		children?: import('svelte').Snippet;
	}

	let {
		open = false,
		animate = true,
		duration = $bindable(0.8),
		placement = 'right',
		size = null,
		zIndex = -1,
		height = null,
		width = null,
		left = null,
		children
	}: Props = $props();

	let mounted = false;

	let h = $state('100%');

	let w = $state('100%');

	let l = $state('0');

	let percentageX = $state(0);

	run(() => {
		if (left) {
			l = left;
		}
	});

	run(() => {
		if (height) {
			h = height;
		}
	});

	run(() => {
		if (width) {
			w = width;
		}
	});

	let transform =
		$derived(placement === 'right'
			? `transform: translate(${percentageX}%, 0);`
			: `transform: translate(0, ${percentageX}%);`);

	let style = $derived(`--duration: ${duration}s; --size: ${size}; z-index: ${zIndex}; ${transform}; height: ${h}; width: ${w}; left: ${l}px`);

	run(() => {
		if (open) {
			if (animate) {
				duration = 0.8;
				percentageX = 100;

				setTimeout(() => {
					percentageX = 0;
				}, 20);
			} else {
				duration = 0;
				percentageX = 0;
			}
		} else {
			if (animate) {
				duration = 0.8;
				percentageX = 0;
				setTimeout(() => {
					percentageX = 100;
				}, 20);
			} else {
				duration = 0;
				percentageX = 100;
			}
		}
	});

	function scrollLock(open) {
		if (mounted) {
			const body = document.querySelector('body');
			body.style.overflow = open ? 'hidden' : 'auto';
		}
	}

	run(() => {
		scrollLock(open);
	});

	onMount(() => {
		mounted = true;
		scrollLock(open);
	});
</script>

<div class="drawer" {style}>
	<div class="panel {placement}">
		{@render children?.()}
	</div>
</div>

<style type="text/postcss">
	.drawer {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: -1;
		transition: transform var(--duration) ease;
	}

	.panel {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 3;
		overflow: hidden;
	}
</style>
