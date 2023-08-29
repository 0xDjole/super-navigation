<script lang="ts">
	import { onMount } from 'svelte';
	import { navigation } from '../lib';

	onMount(() => {
		navigation?.loadUp();
	});
</script>

<div style="height: 100%;">
	<span class="text-white">Screen 2</span>
</div>

<style>
	div {
		background-color: blue;
	}
</style>
