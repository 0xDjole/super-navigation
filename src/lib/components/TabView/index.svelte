<script lang="ts">
	import LazyComponent from '../LazyComponent.svelte';

	export let navigationPath;
	export let navigationScreens;
	export let activeTabIndex;

	let tabView;
	let tabWidth;

	$: if (tabView) {
		tabView.scrollTo({ left: tabWidth * activeTabIndex });
		tabView.style.scrollBehavior = 'smooth';
	}
</script>

{#if navigationScreens && navigationScreens.length}
	<div bind:clientWidth={tabWidth} bind:this={tabView} class="tab-view">
		{#each navigationScreens as navigationScreen}
			<div class="tab-item">
				<LazyComponent
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
