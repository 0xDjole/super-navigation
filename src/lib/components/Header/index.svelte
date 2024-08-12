<script>
	export let sticky = true;
	export let headerClass;
</script>

<div class:header-sticky={sticky} class={`header ${headerClass}`}>
	<div class="header-item">
		<slot class="header-item left" name="left" />
	</div>
	<div class="header-item">
		<slot class="header-item middle" name="middle" />
	</div>
	<div class="header-item">
		<slot class="header-item right" name="right" />
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
