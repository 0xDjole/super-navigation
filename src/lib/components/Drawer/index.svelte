<script>
	import { onMount } from 'svelte';

	export let open = false;
	export let animate = true;
	export let duration = 0.8;
	export let placement = 'right';
	export let size = null;
	export let zIndex = -1;
	export let height = null;
	export let width = null;
	export let left = null;

	let mounted = false;

	let h = '100vh';

	let w = '100%';

	let l = '0';

	let percentageX = 0;

	$: if (left) {
		l = left;
	}

	$: if (height) {
		h = height;
	}

	$: if (width) {
		w = width;
	}

	$: transform =
		placement === 'right'
			? `transform: translate(${percentageX}%, 0);`
			: `transform: translate(0, ${percentageX}%);`;

	$: style = `--duration: ${duration}s; --size: ${size}; z-index: ${zIndex}; ${transform}; height: ${h}; width: ${w}; left: ${l}px`;

	$: if (open) {
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

	function scrollLock(open) {
		if (mounted) {
			const body = document.querySelector('body');
			body.style.overflow = open ? 'hidden' : 'auto';
		}
	}

	$: scrollLock(open);

	onMount(() => {
		mounted = true;
		scrollLock(open);
	});
</script>

<div class="drawer" {style}>
	<div class="panel {placement}">
		<slot />
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
