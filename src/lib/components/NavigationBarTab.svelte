<script lang="ts">
	import SvgIcon from './SvgIcon.svelte';
	export let tab = {};
	export let tabLength = 0;
	export let i;
	export let handleClick;
	export let navbar = {};
	export let isActive = false;

	$: fontFamily = navbar.text.fontFamily;

	$: borderTop = `${navbar.borderTop.width}px solid ${
		tab.isActive ? navbar.borderTop.colorActive : navbar.borderTop.color
	}`;

	$: backgroundColor = tab.isActive ? navbar.background.colorActive : navbar.background.color;
	$: color = isActive ? navbar.text.colorActive : navbar.text.color;
</script>

<li
	style={`border-top: ${borderTop}; background-color: ${backgroundColor}; color: ${color}; font-family: ${fontFamily};
`}
	class="navigation-bar-tab"
	on:click={() => handleClick(tab.path)}
>
	<div style="padding-top: 4px">
		<SvgIcon fill={color} data={tab.icon.data} class="self-end" />
	</div>
</li>

<style type="text/postcss">
	.navigation-bar-tab {
		@apply relative grid font-bold justify-items-center cursor-pointer grid-cols-1 gap-x-5 pt-2;
	}
</style>
