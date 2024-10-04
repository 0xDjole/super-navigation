<script lang="ts">
	import { navigation } from '../../store';
	import LazyComponent from '../LazyComponent.svelte';

	export let navigationPath;
	export let navigationScreens;
	export let activeTabIndex;

	let tabView;
	let tabWidth;

	const onLoad = (index) => {
		tabView.style.scrollBehavior = 'auto';
		tabView.scrollTo({ left: tabWidth * activeTabIndex });
	};

	$: if ($navigation?.loaded && activeTabIndex !== null) {
		tabView.style.scrollBehavior = 'smooth';
		tabView.scrollTo({ left: tabWidth * activeTabIndex });
	}
</script>

{#if navigationScreens && navigationScreens.length}
	<div bind:clientWidth={tabWidth} bind:this={tabView} class="tab-view">
		{#each navigationScreens as navigationScreen, index}
			<div class="tab-item">
				{#if index === activeTabIndex || $navigation?.loaded}
					<LazyComponent
						onLoad={() => onLoad(index)}
						component={navigationScreen.component}
						loader={navigationScreen.loader}
						props={{
							...(navigationScreen.props || {}),
							navigationPath: [
								...navigationPath,
								{ navigationType: 'Tab', index: navigationScreen.index }
							]
						}}
					/>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style type="text/postcss">
	.tab-item {
		@apply w-screen;
	}

	.tab-view {
		@apply flex h-full;
		overflow: hidden;
	}

	.tab-view::-webkit-scrollbar {
		width: 0px;
		height: 0px;
		background: transparent;
	}
</style>
