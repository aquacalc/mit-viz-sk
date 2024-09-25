<script>
	import * as d3 from 'd3';

	export let myPieData;
	export let selectedIndex = -1;
	export let showSlider = false;

	$: console.log(`myPieData = `, myPieData);

	// let { myPieData, query = '' } = $props();

	let arcGenerator = d3.arc().innerRadius(20).outerRadius(50);

	let myEndAngleCoeff = 0;

	$: arc = arcGenerator({
		startAngle: 0 * Math.PI,
		endAngle: myEndAngleCoeff * Math.PI
	});

	$: myEndAngle = myEndAngleCoeff * Math.PI;

	// -------------- //

	// const tot = myPieData.reduce((sum, next) => sum + next, 0);
	$: tot = myPieData.reduce((sum, next) => sum + next.value, 0);

	$: console.log(`TOT = ${tot}`);

	let startAngle = 0;
	let endAngle = 0;

	$: arcsArray = myPieData.map((a) => {
		endAngle = startAngle + (a.value / tot) * 2 * Math.PI;

		console.log(`${startAngle} + (${a.value} / ${tot}) * 2 pi = ${endAngle}`);

		let arcData = {
			startAngle,
			endAngle
		};

		startAngle = endAngle;

		return arcData;
	});

	$: console.log(`ARC array: `, arcsArray);

	$: arcsGenerator = arcsArray.map((arc) => arcGenerator(arc));

	// console.log(`arcsGenerator: `, arcsGenerator);

	// const myFills = ['green', 'yellow', 'red'];
	let myFills = d3.scaleOrdinal(d3.schemeTableau10);

	const toggleWedge = (idx, e) => {
		// console.log(`${e.target.name}: ${idx}`, e.target);

		if (!e.key || e.key === 'Enter') {
			selectedIndex = selectedIndex === idx ? -1 : idx;
			// selectedIndex = idx;
		}
	};

	// ************** //
	// let angle = 0;
	// let arcData2 = [];

	// for (let d of [1, 2]) {
	// 	let endAngle2 = angle + (d / tot) * 2 * Math.PI;
	// 	arcData2.push({ startAngle: angle, endAngle2 });
	// 	angle = endAngle2;
	// }

	// console.log(`arcData2: `, arcData2)

	// -------------- //
</script>

{#if showSlider}
	<div id="range-angle">
		<label for="end-angle">
			End Angle
			<input
				type="range"
				name="end-angle"
				id="end-angle"
				bind:value={myEndAngleCoeff}
				min={-2}
				max={2}
				step={0.001}
			/>
		</label>
		{myEndAngle.toFixed(4)} rad ({(myEndAngle * (180 / Math.PI)).toFixed(2)}°)
	</div>
{/if}

<div class="container">
	<svg viewBox="-50 -50 100 100">
		{#each arcsGenerator as myPath, idx}
			<!-- <g transform="translate(100,0) rotate(0)"> -->
			<!-- <path d={myPath} fill={myFills(idx)} /> -->
			<!-- </g> -->
			<g transform={`translate(10,0) rotate(${myEndAngle * (180 / Math.PI)})`}>
				<!-- on:click={() => (selectedIndex = selectedIndex === idx ? -1 : idx)} -->
				<path
					d={myPath}
					fill={myFills(idx)}
					class:selected={selectedIndex === idx}
					on:click={(e) => toggleWedge(idx, e)}
					tabindex="0"
					role="button"
					aria-label={`Slice ${idx} of pie chart.`}
					style="
	          --start-angle: {arcsArray[idx]?.startAngle}rad;
	          --end-angle: {arcsArray[idx]?.endAngle}rad;"
				/>
			</g>
		{/each}

		<!-- {#each arcs as arc, index}
			<path d={arc} fill={colors(index)} on:click={(e) => (selectedIndex = index)} />
		{/each} -->

		<!-- <path d={arc} fill={myEndAngle > 3.14 || myEndAngle < -3.14 ? 'red' : 'green'} /> -->
		<!-- <circle cx={0} cy={0} r={50} fill="red" /> -->
		<!-- <path d="M -50 0 A 50 50 0 0 1 50 0 A 50 50 0 0 1 -50 0" fill="blue" /> -->
	</svg>

	<ul class="legend">
		<!-- {#each myPieData.sort((a, b) => b.label - a.label) as { value, label }, idx} -->
		<!-- <li style="color: {myFills(myPieData.length - 1 - idx)}"> -->
		{#each myPieData as { value, label }, idx}
			<li style="color: {myFills(idx)}" class:selected={selectedIndex === idx}>
				<span
					class="swatch"
					class:selected={selectedIndex === idx}
					style="background-color: {myFills(idx)}"
				>
				</span>
				{label} ({value})
			</li>
		{/each}
	</ul>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 2rem;
		/* border: 0.5px solid burlywood; */
	}

	svg {
		/* fill: #ead6d6; */
		max-width: 20em;
		margin-block: 2em;

		/* Do not clip shapes outside the viewBox */
		overflow: visible;
	}

	/* svg:has(path:hover) {
    fill: yellow;
  } */

	svg:has(path:hover, path:focus-visible) {
		cursor: pointer;
		opacity: 100%;

		path:not(:hover, focus-visible) {
			opacity: 30%;
		}
	}

	path {
		opacity: 0.65;
		transition: 300ms;
		outline: none;
		/* 
      ...in the CSS we can calculate the difference, 
      and the angle to get to the midpoint of the arc 
    */
		--angle: calc(var(--end-angle) - var(--start-angle));
		--mid-angle: calc(var(--start-angle) + var(--angle) / 2);

		&.selected {
			transform: rotate(var(--mid-angle)) translateY(-6px) scale(1.1)
				rotate(calc(-1 * var(--mid-angle)));
		}

		transform: rotate(var(--mid-angle)) translateY(0) rotate(calc(-1 * var(--mid-angle)));
	}

	.selected {
		--color: oklch(60% 45% 0) !important;
		color: oklch(60% 45% 0) !important;
		opacity: 1;

		&:is(path) {
			fill: var(--color);
		}

		&:is(span) {
			background-color: oklch(60% 45% 0) !important;
			border: 1px solid #aaa;
			font-weight: 600;
			opacity: 100%;
		}

		&:is(li) {
			/* --color: oklch(60% 45% 0) !important; */
			font-weight: 600;
		}
	}

	.legend {
		flex: 1;
		list-style: circle;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
		border: 0.5px solid #aaa;
		border-radius: 4px;
		margin: 0px 2rem;
		padding: 0.75rem;
		/* width: 35%; */
	}

	li {
		display: flex;
		/* justify-content: flex-end; */
		gap: 2rem;
		font-weight: 200;
		opacity: 0.85;
	}

	.swatch {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		opacity: 0.75;
		/* aspect-ratio: 1 / 1; */
		/* background-color: #fff; */
	}

	#range-angle {
		padding-top: 18px;
	}
</style>
