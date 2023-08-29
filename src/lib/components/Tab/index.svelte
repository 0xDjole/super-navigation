<script lang="ts">
	import NavigationBar from '../NavigationBar.svelte';
	import { onMount } from 'svelte';
	import { navigation } from '../../store';
	import TabView from '../TabView/index.svelte';
	import lodash from 'lodash';

	export let screens;
	export let navigationPath = [];
	export let defaultIndex;

	const parse = (navigation, navigationPath) => {
		if (navigation && navigation.navigation) {
			let basePath = 'screens';
			for (let i = 0; i < navigationPath.length; i++) {
				const navItem = navigationPath[i];
				const navItemIndex = navItem.index;
				basePath = basePath.concat(`[${navItemIndex}]`);
			}
			const screenPath = basePath.concat('.navigation.screens');

			const screens = lodash.get(navigation.navigation, screenPath);
			return screens;
		}
		return [];
	};

	onMount(() => {
		navigation.init(screens, 'Tab', window.location, navigationPath, defaultIndex);
	});

	$: navigationScreens = parse($navigation, navigationPath);

	let config = {
		defaultTab: '/',
		navbar: {
			background: {
				color: 'linear-gradient(145deg, ${theme(#1a1a1a)} 0%, #000000 100%)',
				colorActive: '#212121'
			},
			borderTop: { color: '#1c1c1c', colorActive: 'orange', width: 1 },
			text: {
				color: '#5e5e5e',
				colorActive: 'white',
				fontFamily: `'Lato', sans-serif`
			}
		}
	};

	let navbar = config.navbar;

	const handleClick = (path) => {
		const index =
			navigationScreens.findIndex((screen) => screen.path === path) === -1
				? 0
				: navigationScreens.findIndex((screen) => screen.path === path);

		navigation.navigate(path);
	};

	$: activeTabIndex =
		navigationScreens && navigationScreens.length
			? navigationScreens.findIndex((navigationScreen) => navigationScreen.opened)
			: 0;
</script>

{#if navigationScreens && navigationScreens.length}
	<div style={`grid-template-rows: min-content 1fr;`} class="navigation-container">
		<TabView {activeTabIndex} {navigationPath} {navigationScreens} />

		<div class="navigation-bar-wrapper">
			<NavigationBar {navbar} tabs={screens} {handleClick} {activeTabIndex} />
		</div>
	</div>
{/if}

<style type="text/postcss">
	.navigation-container {
		@apply absolute grid min-h-screen w-full;
		margin: 0 auto;
	}

	.navigation-bar-wrapper {
		position: fixed;
		z-index: 100;
		width: 100%;
		bottom: 0;
	}
</style>
