<script lang="ts">
	import { onMount } from 'svelte';
	import { navigation } from '../../store/index.svelte';
	import lodash from 'lodash';

	import Drawer from '../Drawer/index.svelte';
	import Screen from '../Screen/index.svelte';
	import LazyComponent from '../LazyComponent.svelte';

	interface Props {
		screens: any;
		navigationPath?: any;
		background?: string;
		defaultIndex: any;
		children?: import('svelte').Snippet;
	}

	let {
		screens,
		navigationPath = [],
		background = 'bg-primary',
		defaultIndex,
		children
	}: Props = $props();

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

	// Use a reactive statement to update navigationScreens
	let navigationScreens = $derived(parse(navigation, navigationPath));

	onMount(() => {
		navigation.init(screens, 'Stack', window.location, navigationPath, defaultIndex);
	});
</script>

{#if !navigation?.loaded}
	{@render children?.()}
{/if}

<div
	class:not-display={!navigation?.loaded}
	class:display={navigation?.loaded}
	class="stack-wrapper"
>
	{#if navigationScreens && navigationScreens.length}
		{#each navigationScreens as screen, index (screen.key)}
			{#if screen.opened || navigation.navigating}
				<Drawer animate={screen.animate} zIndex={index * 10} open={screen.opened}>
					<div class={`stack-item ${background}`}>
						<Screen
							headerClass={screen.headerClass}
							showBack={screen.showBack}
							navigationPath={[...navigationPath, { navigationType: 'Stack', index: screen.index }]}
							title={screen.title}
							showHeader={screen.showHeader === false ? false : true}
						>
							{#snippet back()}
								<screen.backComponent />
							{/snippet}

							<LazyComponent
								component={screen.component}
								loader={screen.loader}
								props={{
									...(screen.props || {}),
									navigationPath: [
										...navigationPath,
										{ navigationType: 'Stack', index: screen.index }
									]
								}}
							/>
						</Screen>
					</div>
				</Drawer>
			{/if}
		{/each}
	{/if}
</div>

<style type="text/postcss">
	.display {
		@apply opacity-100;
	}

	.not-display {
		@apply opacity-0;
	}

	.stack-wrapper {
		@apply relative w-screen h-full;
	}

	.stack-item {
		@apply z-10 top-0 w-full transition-transform h-full flex flex-col;
	}
</style>
