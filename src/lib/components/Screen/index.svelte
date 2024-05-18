<script lang="ts">
	import { navigation } from '../../store';

	import Header from '../Header/index.svelte';

	export let title;
	export let showBack;
	export let navigationPath;
	export let showHeader = true;
	export let headerClass;

	$: hasTab =
		navigationPath && navigationPath.length
			? navigationPath.some((path) => path.navigationType === 'Tab')
			: false;
</script>

{#if showHeader}
	<Header {headerClass}>
		<div slot="left">
			{#if showBack}
				<div
					class="back"
					on:click={async () => {
						navigation.back();
					}}
				>
					<slot name="back" />
				</div>
			{/if}
		</div>
		<div slot="middle">
			<span class="title">
				{title}
			</span>
		</div>
		<div slot="right" />
	</Header>
{/if}

{#if hasTab}
	<div class="wrap">
		<div class="wrap-scroll">
			<slot />
		</div>
	</div>
{:else}
	<slot />
{/if}

<style type="text/postcss">
	.wrap-scroll {
		@apply flex flex-col w-full h-full overflow-y-scroll;
	}

	.wrap-scroll::-webkit-scrollbar {
		width: 0px;
		background: transparent;
	}

	.title {
		@apply whitespace-nowrap;
	}
	.wrap {
		@apply w-screen mx-auto overflow-hidden h-full;
	}

	.back {
		@apply grid justify-center items-center w-14 h-14 cursor-pointer;
	}
</style>
