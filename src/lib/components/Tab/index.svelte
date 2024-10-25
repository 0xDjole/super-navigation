<script lang="ts">
	import NavigationBar from '../NavigationBar.svelte';
	import { onMount } from 'svelte';
	import { navigation } from '../../store';
	import TabView from '../TabView/index.svelte';
	import lodash from 'lodash';

	let {
		screens,
		navigationPath = [],
		defaultIndex,
		tabClass,
		tabConfig = {
			defaultTab: '/',
			navbar: {
				background: {
					color: 'linear-gradient(145deg, ${theme(#1a1a1a)} 0%, #000000 100%)',
					colorActive: '#212121'
				},
				borderTop: { color: '#8b98a5', colorActive: 'orange', width: 1 },
				text: {
					color: '#5e5e5e',
					colorActive: 'white',
					fontFamily: `'Lato', sans-serif`
				}
			}
		}
	} = $props();

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

	const setVhProperty = () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--super-navigation-vh', `${vh}px`);
	};

	onMount(() => {
		navigation.init(screens, 'Tab', window.location, navigationPath, defaultIndex);
		setVhProperty();
		window.addEventListener('resize', setVhProperty);
	});

	let navigationScreens = $derived(parse($navigation, navigationPath));

	let navbar = tabConfig.navbar;

	const handleClick = (path) => {
		navigation.navigate(path);
	};

	let activeTabIndex = $derived(
		navigationScreens && navigationScreens.length
			? navigationScreens.findIndex((navigationScreen) => navigationScreen.opened)
			: 0
	);
</script>

{#if navigationScreens && navigationScreens.length}
	<div class={`navigation-container ${tabClass}`}>
		<div style="height: calc(var(--super-navigation-vh, 1vh) * 100 - 50px);">
			<TabView {activeTabIndex} {navigationPath} {navigationScreens} />
		</div>

		<NavigationBar {navbar} tabs={screens} {handleClick} {activeTabIndex} />
	</div>
{/if}

<style type="text/postcss">
	.navigation-container {
		@apply absolute min-h-screen w-full flex flex-col;
		margin: 0 auto;
	}

	.navigation-bar-wrapper {
		position: fixed;
		z-index: 100;
		width: 100%;
		bottom: 0;
	}
	.tab-view-wrapper {
		@apply relative;
	}
</style>
