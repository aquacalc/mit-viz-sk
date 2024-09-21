<script>
	// from: https://www.aquanet.com/images/Cage_Table2.jpg
	import * as d3 from 'd3';
	import tilapia from '$lib/tilapia.json';
	import fish from '$lib/fish.json';
	import layer from '$lib/layer.json';
	import broiler from '$lib/broiler.json';

	// console.log("broiler: ", broiler.map(b => {
	//   return {
	//     ...b,
	//     sfr: 100 * b.feed / b.mass
	//   }
	// }));

	// console.log("layer: ", layer.map(b => {
	//   return {
	//     ...b,
	//     sfr: 100 * b.feed / b.mass
	//   }
	// }));

	let width = 500,
		height = 500;

	let xScale = d3.scaleLinear().domain([0, 500]).range([0, width]);
	let yScale = d3
		.scaleLinear()
		.domain([0, 15])
		// .domain([0, 89])
		.range([0.9 * height, 10]);

	// $: console.log(xScale(200));

	const lineGenerator = d3
		.line()
		.x((d) => d.x)
		.y((d) => d.y)
		.curve(d3.curveMonotoneX);

	let tilapia_plot = tilapia.map((d) => ({ x: xScale(d.mass), y: yScale(d.sfr) }));
	let fish_plot = fish.map((d) => ({ x: xScale(d.mass), y: yScale(d.sfr) }));
	let layer_plot = layer.map((d) => ({ x: xScale(d.mass), y: yScale(d.sfr) }));
	let broiler_plot = broiler.map((d) => ({ x: xScale(d.mass), y: yScale(d.sfr) }));

	// $: console.log(`broiler_plot: `, broiler_plot);
	// $: console.log(`tilapia_plot: `, xScale(tilapia_plot[0][0]), ' -- ', tilapia_plot[0][1]);

	let renderedData_tilapia = lineGenerator(tilapia_plot);
	let renderedData_fish = lineGenerator(fish_plot);
	// $: console.log(renderedData_tilapia);
</script>

<h2>Tilapia</h2>

<section bind:clientWidth={width} bind:clientHeight={height}>
	<!-- <svg {width} {height}> -->
	<svg width="500" height="500">
		<!-- {#each renderedData as { path, stroke='red', strokeWidth=3 }} -->

		<path d={lineGenerator(tilapia_plot)} style="fill: none; stroke: red; stroke-width: 3;" />
		<path d={lineGenerator(fish_plot)} style="fill: none; stroke: yellow; stroke-width: 3;" />
		<path d={lineGenerator(layer_plot)} style="fill: none; stroke: orange; stroke-width: 3;" />
		<!-- <path d={lineGenerator(broiler_plot)} style="fill: none; stroke: yellow; stroke-width: 3;" /> -->

		<!-- {/each} -->
	</svg>
</section>
