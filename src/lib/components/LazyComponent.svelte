<!-- LazyComponent.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let component = null;
	export let loader = null;
	export let props = {};
	export let onLoad = () => {};

	let dynamicComponent = component;

	onMount(async () => {
		if (!dynamicComponent && loader) {
			const module = await loader();
			dynamicComponent = module.default;

			setTimeout(() => {
				onLoad();
			}, 10);
		}
	});
</script>

{#if dynamicComponent}
	<svelte:component this={dynamicComponent} {...props} />
{/if}
