<script lang="ts">
	import './styles.css';
	import FakeScreen from './FakeScreen.svelte';
	import FakeScreen2 from './FakeScreen2.svelte';
	import Back from './Back.svelte';
	import { Stack, navigation } from '../lib';
</script>

{#if !$navigation?.loaded}
	<slot />
{/if}

<Stack
	defaultIndex={0}
	screens={[
		{
			component: FakeScreen,
			backComponent: Back,
			title: 'Screen 1',
			headerClass: 'bg-gray-500 border-solid border-b-2 border-gray-300',
			path: '/'
		},
		{
			component: FakeScreen2,
			backComponent: Back,
			title: 'Screen 2',
			path: '/screen2',
			headerClass: 'bg-gray-500 border-solid border-b-2 border-gray-300',
			backDefault: '/'
		}
	]}
/>
