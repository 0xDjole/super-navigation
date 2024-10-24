<!-- LazyComponent.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		component?: any;
		loader?: any;
		props?: any;
		onLoad?: any;
	}

	let { component = null, loader = null, props = {}, onLoad = () => {} }: Props = $props();

	let dynamicComponent = $state(component);

	onMount(async () => {
		if (!dynamicComponent && loader) {
			const module = await loader();
			dynamicComponent = module.default;

			onLoad();
		}
	});
</script>

{#if dynamicComponent}
	{@const SvelteComponent = dynamicComponent}
	<SvelteComponent {...props} />
{/if}
