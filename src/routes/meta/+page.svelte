<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { computePosition, autoPlacement, offset } from '@floating-ui/dom';

	import Stats from '$lib/Stats.svelte';

	let data = [];
	let commits = [];
	let commitsBis = [];
	let commitsFiles = [];

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
					totalLines: lines.length
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

		commits = d3.sort(commits, (d) => -d.totalLines);
	});

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
	$: workByDate = d3.rollups(
		data,
		(v) => v.length,
		(d) =>
			d.datetime.toLocaleString('en', {
				weekday: 'short',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				dayPeriod: 'short'
			})
	);
	// $: console.log('workByPeriod: ', workByPeriod);
	// $: console.log('** workByDate: ', workByDate);
	$: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
	// $: console.log(`maxPeriod: ${maxPeriod}`);
	// $: console.log('workByPeriod: ', d3.greatest(workByPeriod, d => d[1]?.d[0]));

	// Day of the week that most work is done

	// ------ //

	// $: console.log(`data: `, data);

	// $: console.log(`COMMITS: `, commits);

	// $: console.log(`COMMITS_BIS: `, commitsBis);
	// $: console.log(`COMMITS_FILES: `, commitsFiles);
	// $: console.log(
	// 	`COMMITS_BIS: `,
	// 	commitsBis.slice(0, 1).map(([one, two], idx) => console.log(`${idx}: `, one, ' - ', two[0]))
	// );

	$: linesMedian = d3.median(data, (d) => d.line);
	$: linesMax = d3.max(data, (d) => d.line);

	$: fileLengths = d3.rollups(
		data,
		(v) => d3.max(v, (v) => v.line),
		(d) => d.file
	);
	// $: console.log(`--fileLengths-- `, fileLengths);
	// $: console.log(`data: `, data[4]);
	// $: console.log(`commitsBis: `, commitsBis.slice(0, 2));
	// $: console.log(`commits: `, commits.slice(0, 2));
	// $: console.log(d3.min(data, d => d.line))
	// $: console.log(d3.max(data, d => d.line))
	// $: console.log(d3.median(data, d => d.line))
	// $: console.log(numAuths)

	//   *** VIZ ***   //
	// begin VIZ begin //
	let width = 800,
		height = 400;

	let margin = { top: 10, right: 50, bottom: 30, left: 50 };

	let usableArea = {
		top: margin.top,
		right: width - margin.right,
		bottom: height - margin.bottom,
		left: margin.left
	};
	usableArea.width = usableArea.right - usableArea.left;
	usableArea.height = usableArea.bottom - usableArea.top;

	// const myTimeScale = d3.scaleTime();
	// $: console.log(myTimeScale.domain()); // logged on my computer: [Sat Jan 01 2000 00:00:00 GMT+0100, Sun Jan 02 2000 00:00:00 GMT+0100]
	// $: console.log(myTimeScale.range());

	$: extent_datetime = d3.extent(data.map((d) => d.datetime));
	$: extent_loc = d3.extent(commits.map((d) => d.totalLines));
	// $: console.log('extent_datetime : ', extent_datetime );
	// $: console.log(d3.scaleTime().domain(extent_datetime ).range([0, width]).nice())
	// $: console.log('---', extent_datetime , ' -- ', d3.scaleTime.domain(extent));

	$: xScale = d3
		.scaleTime()
		.domain(extent_datetime)
		.range([usableArea.left, usableArea.right])
		.nice();
	// .range([margin.left, width - margin.right]);

	$: yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.top, usableArea.bottom]);
	// $: yScale = d3.scaleLinear().domain([24, 0]).range([usableArea.bottom, usableArea.top]);
	// $: yScale = d3.scaleLinear().domain([24, 0]).range([0, height]);

	// $: rScale = d3.scaleLinear().domain(extent_loc).range([10, 30]);
	$: rScale = d3.scaleSqrt().domain(extent_loc).range([10, 30]);
	// .nice();

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
	$: console.log('work_plot: ', work_plot);

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

	// ** BRUSH ** //
	let svg;
	$: brushSelection = [[], []];

	const brushed = (e) => {
		brushSelection = e.selection;
		// console.log(`brushSelection: `, brushSelection);

		// isCommitSelected()
	};

	const isCommitSelected = (commit) => {
		// console.log(`commit: `, commit);
		console.log(`** brushSelection: `, brushSelection);

		if (!brushSelection) {
			console.log(`FALSE`);
			return false;
		}

		// TODO return true if commit is within brushSelection
		// and false if not

		console.log(`TRUE`, commit);
		let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
		let max = { x: brushSelection[1][0], y: brushSelection[1][1] };

		let x = xScale(commit.datetime);
		let y = yScale(commit.hourFrac);

		console.log(`[${x}, ${y}] vs. `, min, '-', max);
		console.log(`X: ${x >= min.x} && ${x <= max.x}`);
		console.log(`Y: ${y >= min.y} && ${y <= max.y}`);
		console.log(`=> ${x >= min.x && x <= max.x && y >= min.y && y <= max.y}`);
		console.log(`------`);
		console.log(``);

		// if(commit.totalLines === 110) return true;
		// return false;

		return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
	};

	$: {
		d3.select(svg).call(d3.brush().on('start brush end', brushed));

		d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
	}

	// end VIZ end //
	// *** VIZ *** //
</script>

<!-- <h1>Meta</h1> -->
<!-- <p>codebase stats</p> -->

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

	<!-- <h1>--| {cursor.y} | {yScale.invert(cursor.y)}</h1> -->

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
				<g transform="translate({xScale(c.x)}, {yScale(c.y) - 12})">
					<text dominant-baseline="middle" text-anchor="middle" class="label"
						>{idx} [{Math.round(xScale(c.x))}, {Math.round(yScale(c.y))}]: {Math.round(c.y * 100) /
							100}</text
					>
				</g>

				<line
					x1={xScale(c.x)}
					y1={yScale(c.y)}
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
