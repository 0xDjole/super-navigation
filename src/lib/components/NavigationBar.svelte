<script>
	import NavigationBarTab from './NavigationBarTab.svelte';
	let {
		tabs = [],
		navbar,
		handleClick,
		activeTabIndex
	} = $props();
	let columns = tabs.reduce((aggr) => aggr.concat('1fr '), '');
</script>

<ul style={`grid-template-columns: ${columns}`} class="navigation-bar">
	{#each tabs as tab, i}
		<NavigationBarTab
			{handleClick}
			{navbar}
			{tab}
			isActive={activeTabIndex === i}
			{i}
			tabLength={tabs.length}
		/>
	{/each}
</ul>

<style type="text/postcss">
	.navigation-bar {
		@apply w-full grid list-none self-end text-lg flex-1;
	}
</style>
