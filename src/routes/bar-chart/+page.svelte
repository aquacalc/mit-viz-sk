<script>
	import { scaleLinear, extent, select, axisBottom } from 'd3';
	import popn from '$lib/2019.js';

	// ** DIMENSIONS ** //
	let width = 500;
	let height = 270;

	// ** SCALES ** //
	$: popnMax = extent(popn, (d) => d.population);
	$: xScale = scaleLinear()
		.domain([0, popnMax[1]])
		.range([0, width - 80]).nice();

	let myPopnLength = popn.length - 1;
	$: yScale = scaleLinear().domain([0, myPopnLength]).range([0, height]);

	// ** AXES ** //
	let xAxis;
	let yAxis;

	$: select(xAxis).call(axisBottom(xScale).tickFormat(d => d / 1000000).tickSize(-height - 8));
</script>

<div class="container">
	<div class="bar-chart">
		<svg {width} {height}>
      {#each popn as { country, population }, idx}
      <rect
      x={0}
      y={yScale(0.95 * idx)}
      width={xScale(population)}
      height={20}
      fill="steelblue"
      />
      <text class="popn-size" x={xScale(population)} y={yScale(0.95 * idx)} dy="1em" dx="0.5em">
        {country}
      </text>
			{/each}
      <g class='x-axis' transform={`translate(0, ${height + 8})`} bind:this={xAxis} />
		</svg>
	</div>

	<ul>
		{#each popn as { country, population }, idx}
			<li>
				{population} &mdash; {country}
			</li>
		{/each}
	</ul>
</div>

<style>
	.container {
		margin-top: 50px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.bar-chart {
		border: 1px solid gray;
		/* border-radius: 8px; */
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	svg {
		overflow: visible;
	}

  .x-axis {
    opacity: 0.25;
  }

	text {
		fill: seagreen;
	}

	.popn-size {
		text-anchor: start;
		/* fill: aquamarine; */
	}

	ul {
		list-style: none;
	}
</style>
