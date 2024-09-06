<script>
	import * as d3 from 'd3';

	let arcGenerator = d3.arc().innerRadius(20).outerRadius(50);

	let myEndAngleCoeff = 0;

	$: arc = arcGenerator({
		startAngle: 0 * Math.PI,
		endAngle: myEndAngleCoeff * Math.PI
	});

	$: myEndAngle = myEndAngleCoeff * Math.PI;

	// -------------- //

	// const myData = [2, 5, 4, 8, 3, 3, 2, 2];
  
  let myData = [
	{ value: 1, label: "apples" },
	{ value: 2, label: "oranges" },
	{ value: 3, label: "mangos" },
	{ value: 4, label: "pears" },
	{ value: 5, label: "limes" },
	{ value: 5, label: "cherries" }
];

	// const tot = myData.reduce((sum, next) => sum + next, 0);
	const tot = myData.reduce((sum, next) => sum + next.value, 0);

  console.log(`TOT = ${tot}`)

	let startAngle = 0;
	let endAngle = 0;

	let arcsArray = myData.map((a) => {
		endAngle = startAngle + (a.value / tot) * 2 * Math.PI;
		let arcData = {
			startAngle,
			endAngle
		};
		startAngle = endAngle;

		return arcData;
	});

	// console.log(`ARC array: `, arcsArray);

	const arcsGenerator = arcsArray.map((arc) => arcGenerator(arc));

	// console.log(`arcsGenerator: `, arcsGenerator);

	// const myFills = ['green', 'yellow', 'red'];
  let myFills = d3.scaleOrdinal(d3.schemeTableau10);


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

<!-- <h2>Pie Chart</h2> -->

<label for="end-angle">
	End Angle
	<input
		type="range"
		name="end-angle"
		id="end-angle"
		bind:value={myEndAngleCoeff}
		min={-2}
		max={2}
		step={0.01}
	/>
</label>
{myEndAngle.toFixed(2)} rad
<div class="container">
	<svg viewBox="-50 -50 100 100">
		{#each arcsGenerator as myPath, idx}
			<path d={myPath} fill={myFills(idx)} />
		{/each}
		<!-- <path d={arc} fill={myEndAngle > 3.14 || myEndAngle < -3.14 ? 'red' : 'green'} /> -->

		<!-- <circle cx={0} cy={0} r={50} fill="red" /> -->
		<!-- <path d="M -50 0 A 50 50 0 0 1 50 0 A 50 50 0 0 1 -50 0" fill="blue" /> -->
	</svg>

  <ul class="legend">
    {#each myData as {value, label}, idx}
      <li style="--color: { myFills(idx) }">
        <span class="swatch"></span>
        {label} <em>({value})</em>
      </li>
    {/each}
  </ul>
  
</div>

<style>
	.container {
		border: 0.5px solid burlywood;
	}

	svg {
		/* fill: #ead6d6; */
		max-width: 20em;
		margin-block: 2em;

		/* Do not clip shapes outside the viewBox */
		overflow: visible;
	}

	path {
    opacity: 0.85;
  }
</style>
