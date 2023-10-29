<script lang="ts">
	import { onMount } from 'svelte';
	import { navigation } from '../lib';

	onMount(() => {
		navigation?.loadUp();
	});
</script>

<div style="height: 100%;">
	<span class="text-white">Screen 1</span>
	<div>
		<button
			class="bg-green-300 p-3"
			on:click={() => navigation?.navigate('/screen2?persistentValue=10')}>Go to screen 2</button
		>
	</div>
</div>

<style>
	div {
		background-color: red;
	}
</style>
