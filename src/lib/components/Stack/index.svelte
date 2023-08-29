<script lang="ts">
	import { onMount } from 'svelte';
	import { navigation } from '../../store';
	import lodash from 'lodash';

	import Drawer from '../Drawer/index.svelte';
	import Screen from '../Screen/index.svelte';
	export let screens;
	export let navigationPath = [];

	let navigationScreens = [];
	export let defaultIndex;

	const parse = (navigation, navigationPath) => {
		if (navigation && navigation.navigation) {
			let basePath = 'screens';
			for (let i = 0; i < navigationPath.length; i++) {
				const navItem = navigationPath[i];
				const navItemIndex = navItem.index;
				basePath = basePath.concat(`[${navItemIndex}].navigation.screens`);
			}
			const screenPath = basePath;
			const historyPath = basePath.slice(0, -7).concat('history');

			const history = lodash.get(navigation.navigation, historyPath);
			const screensNav = lodash.get(navigation.navigation, screenPath);

			if (history && history.length) {
				const activeScreens = [];
				for (let i = 0; i < history.length; i++) {
					const historyIndex = history[i];
					const numOfSame = activeScreens.filter((i) => i.index === historyIndex).length;

					activeScreens.push({
						...screensNav[historyIndex],
						showHeader: screens[historyIndex].showHeader,
						headerClass: screens[historyIndex].headerClass,
						showBack: historyIndex > 0,
						key: `${historyIndex}.${numOfSame}`
					});
				}

				return activeScreens;
			}
		}

		return [];
	};

	$: navigationScreens = parse($navigation, navigationPath);

	onMount(() => {
		navigation.init(screens, 'Stack', window.location, navigationPath, defaultIndex);
	});
</script>

<div class="stack-wrapper">
	{#if navigationScreens && navigationScreens.length}
		{#each navigationScreens as screen, index (screen.key)}
			<Drawer animate={screen.animate} zIndex={index * 10} open={screen.opened}>
				<Screen
					headerClass={screen.headerClass}
					showBack={screen.showBack}
					navigationPath={[...navigationPath, { navigationType: 'Stack', index: screen.index }]}
					title={screen.title}
					showHeader={screen.showHeader === false ? false : true}
				>
					<svelte:component
						this={screen.component}
						navigationPath={[...navigationPath, { navigationType: 'Stack', index: screen.index }]}
					/>
				</Screen>
			</Drawer>
		{/each}
	{/if}
</div>

<style type="text/postcss">
	.stack-wrapper {
		@apply relative w-screen min-h-screen h-full;
	}
</style>
