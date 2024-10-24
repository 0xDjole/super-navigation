<script lang="ts">
	import SvgIcon from './SvgIcon.svelte';
	interface Props {
		tab?: any;
		tabLength?: number;
		i: any;
		handleClick: any;
		navbar?: any;
		isActive?: boolean;
	}

	let {
		tab = {},
		tabLength = 0,
		i,
		handleClick,
		navbar = {},
		isActive = false
	}: Props = $props();

	let fontFamily = $derived(navbar.text.fontFamily);

	let borderTop = $derived(`${navbar.borderTop.width}px solid ${
		tab.isActive ? navbar.borderTop.colorActive : navbar.borderTop.color
	}`);

	let backgroundColor = $derived(tab.isActive ? navbar.background.colorActive : navbar.background.color);
	let color = $derived(isActive ? navbar.text.colorActive : navbar.text.color);
</script>

<li
	style={`border-top: ${borderTop}; background-color: ${backgroundColor}; color: ${color}; font-family: ${fontFamily};
`}
	class="navigation-bar-tab"
	onclick={() => handleClick(tab.path)}
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
