<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [sticky]
	 * @property {any} headerClass
	 * @property {import('svelte').Snippet<[any]>} [left]
	 * @property {import('svelte').Snippet<[any]>} [middle]
	 * @property {import('svelte').Snippet<[any]>} [right]
	 */

	/** @type {Props} */
	let {
		sticky = true,
		headerClass,
		left,
		middle,
		right
	} = $props();
</script>

<div class:header-sticky={sticky} class={`header ${headerClass}`}>
	<div class="header-item">
		{@render left?.({ class: "header-item left", })}
	</div>
	<div class="header-item">
		{@render middle?.({ class: "header-item middle", })}
	</div>
	<div class="header-item">
		{@render right?.({ class: "header-item right", })}
	</div>
</div>

<style type="text/postcss">
	.header-item {
		@apply grid justify-center;
	}

	.header {
		@apply top-0 bg-primary text-primary text-2xl font-bold grid grid-flow-col gap-x-2 justify-start items-center w-full;
		grid-template-columns: 1fr 5fr 1fr;
		height: 60px;
		@screen md {
			height: 80px;
			@apply text-5xl;
		}
	}

	.header-sticky {
		@apply sticky;
	}
</style>
