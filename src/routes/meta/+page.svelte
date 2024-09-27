<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { computePosition, autoPlacement, offset } from '@floating-ui/dom';

	import Stats from '$lib/Stats.svelte';

	import Pie from '$lib/components/d3js/Pie.svelte';

	let data = [];
	let commits = [];
	let commitsBis = [];
	let commitsFiles = [];

	// commits with breakdown of file types
	let selectedCommitTypes_2;

	onMount(async () => {
		// GITHUB DATA in /static as 11-column .csv file
		// file, line, type, commit, author, date, time, timezone, datetime, depth, length
		data = await d3.csv('loc.csv', d3.autoType);

		// data GROUPED BY COMMIT
		// GROUPS() returns an array, each element of which is an array with two elements:
		// 		The first is the (unique) commit identifier
		// 		The second is an array of objects, each object of which holds
		// 				the 11 key-value pairs of a specific LINE of the commit
		// 				to which it belongs

		// That array of 2-element arrays is then MAP-ped to build a data structure
		// that is more convenient for the calculation of stats and plotting

		// commitsBis = d3.groups(data, (d) => d.commit);
		// commitsFiles = d3.groups(data, (d) => d.file);

		// see: https://vis-society.github.io/labs/7/#fn:eachcommit
		commits = d3
			.groups(data, (d) => d.commit)
			.map(([commit, lines]) => {
				// Take the first object in the second element's array...
				let first = lines[0];

				// ...and destructure 5 of the 11 keys therein...
				// (NB: these 5 keys do not change within a commit)
				let { author, date, time, timezone, datetime } = first;

				// ...then compose a "ret" ("return") object
				//    with data to use for stats and charting
				let ret = {
					id: commit,
					url: 'https://github.com/aquacalc/mit-viz-sk/commit/' + commit,
					author,
					date,
					time,
					timezone,
					datetime,
					hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
					totalLines: lines.length,
					// Add breakdown of file types to decorate brushed <circle>s
					// when click/expand a slice of Pie.svelte
					fileTypes: d3
						.rollups(
							lines,
							(v) => v.length,
							(d) => d.type
						)
						.reduce((accumulator, [key, value]) => {
							accumulator[key] = value;
							return accumulator;
						}, {})
				};

				// number of lines modified by this commit
				// Like ret.lines = lines
				// but non-enumerable so it doesn’t show up in JSON.stringify
				Object.defineProperty(ret, 'lines', {
					value: lines,
					configurable: true,
					writable: true,
					enumerable: false
				});

				return ret;
			});

		// For each commit, add a key for each file type

		// commits = commits.map((x) => ({
		selectedCommitTypes_2 = commits.map((x) => ({
			...x

			// fileTypes: d3
			// 	.rollups(
			// 		x.lines,
			// 		(v) => v.length,
			// 		(d) => d.type
			// 	)
			// 	.reduce((accumulator, [key, value]) => {
			// 		accumulator[key] = value;
			// 		return accumulator;
			// 	}, {})
		}));

		commits = d3.sort(commits, (d) => -d.totalLines);

		// let proxy = commits
		// console.log(`0. PROXY = `, proxy)

		// proxy = proxy.map(d => ({...d, "yadda": d.author}))
		// console.log(`1. PROXY = `, proxy)

		// console.log(`^^selectedCommitTypes_2^^: `, selectedCommitTypes_2);
	});

	// For each commit, add a key for each file type
	// commits = commits.map((x) => ({
	// 	// selectedCommitTypes_2 = commits.map((x) => ({
	// 	...x,

	// 	fileTypes: d3
	// 		.rollups(
	// 			x.lines,
	// 			(v) => v.length,
	// 			(d) => d.type
	// 		)
	// 		.reduce((accumulator, [key, value]) => {
	// 			accumulator[key] = value;
	// 			return accumulator;
	// 		}, {})
	// }));

	// $: console.log(`data: `, data);
	$: console.log(`COMMITS: `, commits);

	// ------ //
	// see: https://www.npmjs.com/package/elocuent
	// ** Field	-- Description ** //
	// file	    -- The file the line is from
	// line	    -- The line number in the file
	// type	    -- The type of code ("html", "css", "js", "svelte")
	// commit   -- The identifier (SHA hash) of the commit that last changed this line
	// date	    -- The date the commit was made
	// time	    -- The time the commit was made
	// timezone	-- The timezone the commit was made
	// datetime	-- The full date and time (including timezone) in ISO 8601 format
	// author	  -- The full name of the author of the last commit that changed this line
	// depth	  -- The indentation level of the line
	// length	  -- The number of characters in the line after trimming (i.e. excluding whitespace at the start and end)

	// NUMBER OF FILES in the codebase
	$: numFiles = d3.groups(data, (d) => d.file).length;
	// $: console.log(`Files ∆'d: `, numFiles);

	// NUMBER OF AUTHORS in the codebase
	// $: numAuths = d3.groups(data, (d) => d.author).length;

	// NUMBER OF COMMITS in the codebase
	$: numCommits = d3.groups(data, (d) => d.commit).length;
	// $: console.log(`Commits: `, numCommits);

	// MAXimum FILE LENGTH (number of characters in line after trimming)
	$: fileLength_Max = d3.max(data, (d) => d.length);
	// $: console.log(`Max file length: `, fileLength_Max, ' characters');
	$: fileWithLength_Max = data.find((d) => d.length === fileLength_Max);
	// $: console.log(
	// 	`File with max file length: `,
	// 	fileWithLength_Max,
	// 	' in commit: ',
	// 	fileWithLength_Max?.commit
	// );

	// Longest file

	// AVERAGE FILE LENGTH (in lines)
	$: fileLength_Mean = d3.mean(data, (d) => d.length);
	// $: console.log(`Mean file length: `, fileLength_Mean, ' characters');

	// MEDIAN FILE LENGTH (in lines)
	$: fileLength_Median = d3.median(data, (d) => d.length);
	// $: console.log(`Median file length: `, fileLength_Median, ' characters');
	$: fileWithLength_Median = data.filter((d) => d.length === fileLength_Median);
	// $: console.log(
	// 	`${fileWithLength_Median.length} files hve the median file length (${fileLength_Median} characters)`
	// );

	// Average line length (in characters)

	// Longest line length

	// Longest line

	// Maximum depth
	$: maxDepth = d3.max(data, (d) => d.depth);
	// $: console.log(`maxDepth --> ${maxDepth}`);
	// Which line(s) have max depth?
	// $: console.log(data.filter((d) => d.depth === maxDepth));

	// Deepest line

	// Average depth

	// Average file depth

	// Time of day (morning, afternoon, evening, night) that most work is done
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
	$: workByPeriod = d3.rollups(
		data,
		(v) => v.length,
		(d) => d.datetime.toLocaleString('en', { dayPeriod: 'short' })
	);

	$: fileTypeGroups = d3.rollups(
		data,
		(v) => v.length,
		(d) => d.type
	);
	// $: console.log(`fileTypeGroups`, fileTypeGroups);
	// $: {
	// 	console.log(`----=====----`);
	// 	console.log('fileTypeGroups: ', fileTypeGroups);
	// 	console.log(`----=====----`);
	// }
	// $: console.log(`workByPeriod`, workByPeriod)

	// $: workByDate = d3.rollups(
	// 	data,
	// 	(v) => v.length,
	// 	(d) =>
	// 		d.datetime.toLocaleString('en', {
	// 			weekday: 'short',
	// 			month: 'short',
	// 			day: '2-digit',
	// 			hour: '2-digit',
	// 			dayPeriod: 'short'
	// 		})
	// );

	$: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
	// Day of the week that most work is done

	// ------ //

	$: linesMedian = d3.median(data, (d) => d.line);
	$: linesMax = d3.max(data, (d) => d.line);

	$: fileLengths = d3.rollups(
		data,
		(v) => d3.max(v, (v) => v.line),
		(d) => d.file
	);

	//   *** VIZ ***   //
	// begin VIZ begin //
	let width = 800,
		height = 400;

	// let margin = { top: 10, right: 50, bottom: 30, left: 50 };
	let margin = { top: 10, right: 20, bottom: 50, left: 220 };

	let usableArea = {
		top: margin.top,
		right: width - margin.right,
		bottom: height - margin.bottom,
		left: margin.left
	};
	usableArea.width = usableArea.right - usableArea.left;
	usableArea.height = usableArea.bottom - usableArea.top;

	$: extent_datetime = d3.extent(data.map((d) => d.datetime));
	$: extent_loc = d3.extent(commits.map((d) => d.totalLines));

	$: xScale = d3
		.scaleTime()
		.domain(extent_datetime)
		.range([usableArea.left, usableArea.right])
		.nice();
	// .range([margin.left, width - margin.right]);

	$: yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.top, usableArea.bottom]);

	// $: rScale = d3.scaleLinear().domain(extent_loc).range([10, 30]);
	$: rScale = d3.scaleSqrt().domain(extent_loc).range([10, 30]);

	const lineGenerator = d3
		.line()
		.x((d) => d.x)
		.y((d) => d.y)
		.curve(d3.curveMonotoneX);

	let xAxis, yAxis;
	$: {
		d3.select(xAxis).call(d3.axisBottom(xScale));
	}
	$: d3.select(yAxis).call(
		d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00')
	);

	// y-grid lines
	// https://vis-society.github.io/labs/7/#fn:eachcommit
	// "Just like with the axes, we create a JS variable
	// to hold the axis (I called it yAxisGridlines),
	// and use a reactive statement that starts off
	// identical to the one for our yScale.
	// However, instead of a proper tickFormat() that
	// actually formats axis labels, we use
	// tickFormat("") to remove the labels.
	// Thenm we use the axis.tickSize() method with a
	// tick size of -usableArea.width to make the
	// lines extend across the whole chart (the - is
	// to flip them).
	let yAxisGridlines;
	let xAxisGridlines;

	$: d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

	$: d3.select(xAxisGridlines).call(
		d3
			.axisBottom(xScale)
			.tickFormat('')
			.tickSize(height - usableArea.top)
	);
	// PLOT DATA
	// $: work_plot = commits.map((d) => ({ x: xScale(d.datetime), y: yScale(d.hourFrac) }));
	$: work_plot = commits.map((d) => ({ ...d, x: d.datetime, y: d.hourFrac, r: d.totalLines }));

	// $: console.log(commits);
	// $: console.log('work_plot: ', work_plot);

	// $: commits.map((c) => console.log(`??? ${c.datetime}: ${c.hourFrac}, ${yScale(c.hourFrac)}`));
	// $: commits.map((c) => console.log(`??? ${c.datetime}, ${xScale(c.datetime)}`));

	// [NB] Sorted by xScale-d datetime to render line
	$: work_plot_sorted = commits
		.map((d) => ({ x: xScale(d.datetime), y: yScale(d.hourFrac) }))
		.sort((a, b) => xScale(a.x) - xScale(b.x));
	// $: console.log('work_plot_sorted: ', work_plot_sorted);

	// TOOLTIP
	let cursor = { x: 0, y: 0 };

	let commitTooltip;
	let tooltipPosition = { x: 0, y: 0 };

	const dotInteraction = async (evt, idx) => {
		let hoveredDot = evt.target;

		if (evt.type === 'mouseenter' || evt.type === 'focus') {
			hoveredIndex = idx;
			cursor = { x: evt.x, y: evt.y };
			tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
				strategy: 'fixed', // because we use position: fixed
				middleware: [
					offset(5), // spacing from tooltip to dot
					autoPlacement() // see https://floating-ui.com/docs/autoplacement
				]
			});
		} else if (evt.type === 'mouseleave' || evt.type === 'blur') {
			hoveredIndex = -1;
		}
	};

	let hoveredIndex = -1;
	$: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

	// [NB] NOT sorted by xScale-d datetime to populate tooltip
	// $: hoveredCommit = work_plot[hoveredIndex] ?? {};

	// $: console.log(`hoveredCommit[${hoveredIndex}] = `, hoveredCommit);

	// **       BRUSH       ** //
	// **       BRUSH       ** //
	// **       BRUSH       ** //
	let svg;
	$: brushSelection = [[], []];

	let brushedTotal = 0;

	// "Selecting a wedge doesn’t really do that much right now.
	// However, the ability to select a wedge becomes truly powerful
	// when handled by the parent page."
	// Step 5: https://vis-society.github.io/labs/6/
	let selectedTypeIndex = -1;
	let selectedType;
	let selectedCommitTypes;
	let selectedCommits;

	// [NB] Beautiful logic
	$: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
	$: hasSelection = brushSelection && selectedCommits.length > 0;

	$: console.log(`***** selectedCommits: `, selectedCommits);

	$: console.log(
		`+++++ `,
		selectedCommits?.map((x) => console.log(x))
	);
	// File types ∆d in brushed commits
	$: {
		console.log(`00000 selectedCommits `, selectedCommits);

		// NOT ITERABLE BECAUSE IT'S...an object??!
		selectedCommitTypes = selectedCommits.map((x) =>
			d3.rollups(
				x.lines,
				(v) => v.length,
				(d) => d.type
			)
		);
		console.log(`11111`);
	}

	$: resultArray3 = d3.rollups(
		selectedCommitTypes.flat(1),
		(v) => d3.sum(v, (d) => d[1]), // Sum the second elements of the groups
		(d) => d[0] // Group by the first element
	);

	// ================ //
	// ================ //

	$: myPieData = resultArray3.map(([label, value]) => ({ label, value }));

	// $: console.log(`resultArray3 -- `, resultArray3);
	// $: console.log(`myPieData -- `, myPieData);
	// .sort((a, b) => a.label - b.label);

	// ================ //
	// ================ //

	const brushed = (e) => {
		brushSelection = e.selection;
	};

	const isCommitSelected = (commit) => {
		if (!brushSelection) {
			console.log(`FALSE`);
			// brushedTotal = 0;
			return false;
		}

		let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
		let max = { x: brushSelection[1][0], y: brushSelection[1][1] };

		let x = xScale(commit.datetime);
		let y = yScale(commit.hourFrac);

		let brushTest = x >= min.x && x <= max.x && y >= min.y && y <= max.y;

		return brushTest;
	};

	$: {
		d3.select(svg).call(d3.brush().on('start brush end', brushed));

		d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
	}

	$: {
		// (1) When at least one <circle> in the scatterplot is brushed, the pie chart
		//     of file types in brushed <circle>s is displayed to the right (below, on small screens)

		// (2) When a pie chart segment is selected, its selectedTypeIndex, a prop of Pie.svelte
		//     which is bound to <Pie /> in this file, is assigned to selectedType

		selectedType = selectedTypeIndex > -1 ? myPieData[selectedTypeIndex]?.label : null;
		// filteredByType = projects.filter((d) => d.year === selectedType);

		// Get file type represented by 'popped' pie slice
		// [**] In onMount(), add key/value pairs for each
		//      file type for every commit

		// console.log(`selectedTypeIndex: `, selectedTypeIndex);

		// --- Aspetta! Già l'abbiamo qui... --- //
		// --- MUST ADD ID to each array element of selectedCommitTypes array
		// --- OR...add this info to commit in onMount()...?

		console.log(`++ selectedCommitTypes ++ `, selectedCommitTypes);
		console.log(`selectedType: `, selectedType);

		// Get number of this file type in each brushed <circle>
		// console.log(`commits: `, commits);

		console.log(`selectedCommits: `, selectedCommits);
		console.log(
			`selectedCommits[0]?.fileTypes[${selectedType}], ${selectedCommits[0]?.id}: `,
			selectedCommits[0]?.fileTypes[selectedType]
		);
		// console.log(`resultArray3: `, resultArray3);
		console.log(` --- `);
		console.log(`  `);
	}

	// end VIZ end //
	// *** VIZ *** //
</script>

<Stats {data} {linesMedian} {linesMax} {numFiles} />

<div class="">
	<dl
		bind:this={commitTooltip}
		id="commit-tooltip"
		class="info tooltip"
		hidden={hoveredIndex === -1}
		style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
	>
		<!-- <dl class="info" hidden={hoveredIndex === -1}> -->

		<dt>Commit</dt>
		<dd><a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a></dd>

		<dt>Date</dt>
		<dd>{hoveredCommit.datetime?.toLocaleString('en', { dateStyle: 'full' })}</dd>
		<!-- <dd>{hoveredCommit.date?.toLocaleString('en', { dateStyle: 'full' })}</dd> -->

		<!-- Add: Time, author, lines edited -->
		<dt>TOC</dt>
		<dd>{hoveredCommit.totalLines}</dd>
		<dt>Hour</dt>
		<dd>{Math.round(hoveredCommit.hourFrac * 100) / 100}</dd>
		<!-- <hr />
		<input type="checkbox" name="proba" id="proba" > -->
	</dl>

	<!-- <p style="display: flex; justify-content: space-around;">
		{#each resultArray3 as type}
		<span>
			{type[0]}: {type[1]}
			</span>
			{/each}
			</p> -->

	<div
		class="harness"
		style="width: 80%; margin-left: 100px; display: flex; justify-content: space-around; flex-direction: row-reverse;"
	>
		<div class="my-pie" style="min-width: 30%;">
			<p style="text-align: center;">
				{hasSelection ? selectedCommits.length : 'No'} commit{selectedCommits.length === 1
					? ''
					: 's'} selected
			</p>

			{#if myPieData.length > 0}
				<!-- <p>
					| {selectedType} |
				</p> -->
				<Pie id="pie" {myPieData} bind:selectedIndex={selectedTypeIndex} />
			{:else}
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur neque magnam natus,
					alias beatae assumenda iusto optio fugit tenetur corrupti at excepturi dolorum, architecto
					id doloremque! Tenetur asperiores qui soluta?
				</p>
			{/if}
		</div>

		<!-- <div class="my-svg"> -->
		<svg viewBox="0 0 {width} {height}" bind:this={svg}>
			<g class="gridlines" transform="translate({usableArea}, 0)" bind:this={xAxisGridlines} />
			<g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />

			<g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
			<g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

			<!-- <path
			d={lineGenerator(work_plot_sorted)}
			style="fill: none; stroke: orange; stroke-width: 3;"
		/> -->

			<g class="dots">
				{#each work_plot as c, idx}
					<!-- <g transform="translate({xScale(c.x)}, {yScale(c.y) - 12})">
					<text dominant-baseline="middle" text-anchor="middle" class="label"
						>{idx} [{Math.round(xScale(c.x))}, {Math.round(yScale(c.y))}]: {Math.round(c.y * 100) /
							100}</text
					>
				</g> -->

					<line
						x1={xScale(c.x)}
						y1={yScale(c.y) + rScale(c.r)}
						x2={xScale(c.x)}
						y2={yScale(24)}
						stroke="orange"
						stroke-width={1}
					/>

					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<g transform="translate({xScale(c.x)}, {yScale(c.y) - 0})">
						<text dominant-baseline="middle" text-anchor="middle" class="label no-select">
							{c.r}
						</text>
					</g>

					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_role_supports_aria_props -->
					<circle
						cx={xScale(c.x)}
						cy={yScale(c.y)}
						r={rScale(c.r)}
						fill="steelblue"
						on:mouseenter={(evt) => dotInteraction(evt, idx)}
						on:mouseleave={(evt) => dotInteraction(evt, idx)}
						on:mousefocus={(evt) => dotInteraction(evt, idx)}
						on:mouseblur={(evt) => dotInteraction(evt, idx)}
						class:selected={isCommitSelected(c)}
						tabindex="0"
						aria-describedby="commit-tooltip"
						role="tooltip"
						aria-haspopup="true"
					/>
				{/each}
			</g>
		</svg>
		<!-- </div> -->
	</div>
</div>
<hr />

<!-- <div class="flex">
	<div class="box">{commits.length} commits</div>
	<div class="box">{data.length} LOC</div>
	<div class="box">{commits.length} commits</div>
	<div class="box">Four</div>
	<div class="box">Five</div>
</div>

<hr />
<div class="flex-top-bottom">
	<div class="box-top-bottom">{commits.length} commits</div>
	<div class="box-top-bottom">{data.length} LOC</div>
	<div class="box-top-bottom">{commits.length} commits</div>
	<div class="box-top-bottom">Four</div>
	<div class="box-top-bottom">Five</div>
</div> -->

<!-- <p>Total lines of code: {data.length}</p> -->

<style>
	svg {
		overflow: visible;
		/* border: 1px solid gray; */
		/* background: rgb(219, 219, 191); */
		/* background-color: #1f1f1f; */
		/* border-radius: 12px; */
		margin: 30px;
	}

	@keyframes marching-ants {
		to {
			stroke-dashoffset: -8; /* 5 + 3 */
		}
	}

	svg :global(.selection) {
		fill-opacity: 10%;
		stroke: orange;
		stroke-opacity: 70%;
		stroke-dasharray: 5 3;
		animation: marching-ants 2s linear infinite;
	}

	.gridlines {
		stroke-opacity: 0.15;
	}

	dl.info {
		display: grid;
		grid-template-columns: 1fr 3fr;
		background-color: oklch(100% 0% 0 / 80%);
		border: 0.5px solid #888;
		border-radius: 8px;
		backdrop-filter: blur(2px);
		/* max-width: 20%; */
		padding: 8px;
		box-shadow: 5px 5px #696969;

		transition-duration: 500ms;
		transition-property: opacity, visibility;

		&[hidden]:not(:hover, :focus-within) {
			opacity: 0;
			visibility: hidden;
		}
	}

	.tooltip {
		color: #666;
		position: fixed;
		top: 1em;
		left: 1em;
	}

	circle {
		transition: 200ms;
		transform-origin: center;
		transform-box: fill-box;
		opacity: 0.5;

		&:hover {
			transform: scale(1.5);
			fill: orange;
			opacity: 0.8;
		}
	}

	.selected {
		fill: brown;
		stroke: crimson;
		stroke-width: 8;
	}

	.label {
		font-size: 0.7rem;
		fill: #888;
		/* fill: rgb(249, 249, 249); */
		/* text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); */
		font-family: Futura;
	}

	.no-select {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	/* see: https://youtu.be/1zKX71GYisE */
	.flex {
		display: flex;
		/* flex-direction: column; */
		gap: 1rem;
		margin: 3rem;
		/* writing-mode: vertical-lr; */
	}

	.box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		/* flex-grow: 1; */
		width: 90px;
		border: 1px solid red;
		border-radius: 4px;
		background-color: rgb(255, 0, 0.5);

		/* DEFAULTS */
		/* flex-shrink: 1; */
		/* flex-grow: 0; */
		/* flex-basis: auto; */
	}

	.box:first-child {
		background-color: blue;
		margin-right: auto;
	}

	.box:nth-child(2) {
		margin-right: auto;
	}

	/* -- TOP-BOTTOM -- */

	.flex-top-bottom {
		display: flex;
		align-content: space-between;
		gap: 8rem;
		flex-wrap: wrap;
		height: 400px;
		border: 5px solid rgb(108, 92, 191);
	}

	.box-top-bottom {
		width: 100px;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: hsl(200, 100%, 80%);
		border: 3px solid hsl(200, 100%, 50%);
	}

	.box-top-bottom:nth-child(4) {
		border: 3px solid hsl(36, 100%, 50%);
	}
</style>
