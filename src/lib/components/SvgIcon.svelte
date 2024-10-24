<script lang="ts">

	interface Props {
		data?: string;
		viewBox?: any;
		size?: string;
		width?: any;
		height?: any;
		color?: string;
		stroke?: string;
		fill?: any;
		[key: string]: any
	}

	let {
		data = '',
		viewBox = extractViewBox(data),
		size = '25px',
		width = size,
		height = size,
		color = '',
		stroke = '',
		fill = color,
		...rest
	}: Props = $props();
	let elements = $derived(data.replace(/<svg ([^>]*)>/, '').replace('</svg>', ''));
	function extractViewBox(svg) {
		const regex = /viewBox="([\d\- \.]+)"/;
		const res = regex.exec(svg);
		if (!res) return '0 0 20 20'; // default value
		return res[1];
	}
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} {viewBox} {stroke} {fill} {...rest}>
	{@html elements}
</svg>
