<!-- LazyComponent.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let component = null;
	export let loader = null;
	export let props = {};

	let dynamicComponent = component;

	$: console.log('props', props);
	onMount(async () => {
		if (!dynamicComponent && loader) {
			const module = await loader();
			dynamicComponent = module.default;
		}
	});
</script>

{#if dynamicComponent}
	<svelte:component this={dynamicComponent} {...props} />
{/if}
