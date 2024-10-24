<script lang="ts">
	import { navigation } from '../../store';

	import Header from '../Header/index.svelte';

	interface Props {
		title: any;
		showBack: any;
		navigationPath: any;
		showHeader?: boolean;
		headerClass: any;
		back?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		showBack,
		navigationPath,
		showHeader = true,
		headerClass,
		back,
		children
	}: Props = $props();

	let hasTab =
		$derived(navigationPath && navigationPath.length
			? navigationPath.some((path) => path.navigationType === 'Tab')
			: false);
</script>

{#if showHeader}
	<Header {headerClass}>
		{#snippet left()}
			<div>
				{#if showBack}
					<div
						class="back"
						onclick={async () => {
						navigation.back();
					}}
					>
						{@render back?.()}
					</div>
				{/if}
			</div>
			{/snippet}
		{#snippet middle()}
			<div>
				<span class="title">
					{title}
				</span>
			</div>
		{/snippet}
		{#snippet right()}
			<div />
		{/snippet}
	</Header>
{/if}

{#if hasTab}
	<div class="wrap">
		<div class="wrap-scroll">
			{@render children?.()}
		</div>
	</div>
{:else}
	{@render children?.()}
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
