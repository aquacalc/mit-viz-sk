<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let data = [];
	let commits = [];
	let commits_2 = [];

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

	onMount(async () => {
		data = await d3.csv('loc.csv', d3.autoType);
		data = data.filter((d) => d.commit !== 0);

		commits = d3.groups(data, (d) => d.commit);

		commits = commits.map(([commit, lines], idx) => {
			let { author, date, datetime, time, timezone } = lines[0];

			let returnObj = {
				id: commit,
				author,
				date,
				datetime,
				time,
				timezone,
				hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
				totalLines: lines.length,
				url: `https://github.com/aquacalc/mit-viz-sk/commit/${commit}`
			};

			// Like ret.lines = lines
			// but non-enumerable so
			// it doesn’t show up in JSON.stringify
			Object.defineProperty(returnObj, 'lines', {
				value: lines,
				writable: true,
				enumerable: false,
				configurable: true
			});

			return returnObj;
		});

		// The Object.defineProperty() static method defines
		// a new property directly on an object, or modifies
		// an existing property on an object, and returns
		// the object.
		// Object.defineProperty(obj, prop, descriptor)
	});

	// $: console.log(`DATA: `, data);
	// $: console.log(`COMMITS: `, commits);

	// Number of files in the code base
	$: groupByFiles = d3.groups(data, (d) => d.file);
	$: groupByLength = d3.groups(data, (d) => d.length);
	$: maxDepth = d3.max(data, (d) => d.depth);
	// $: console.log(`maxDepth: `, maxDepth);
	// $: console.log(`groupByFiles: `, groupByFiles);
	// $: console.log(`groupByLength: `, groupByLength);

	// [Q] What is the mean number of lines in
	//     all all files in the (commited) code base?
	// 1. Calc number of lines in each file
	// $: fileLengths = d3.rollups(
	// 	data,
	// 	(v) => d3.max(v, (v) => v.line),
	// 	(d) => d.file
	// );
	// $: console.log(`fileLengths: `, fileLengths);
	// 1. Calc mean of the max number of lines in a file
	// $: MEAN_fileLength = d3.mean(fileLengths.map(d => d[1]))
	// ID the file with the most lines...
	// $: target = fileLengths.filter(f => f[1] === MAX_fileLength)
	// $: console.log(`target = `, target)

	// [Q] At what time of the day is most work done?
	// $: workByPeriod = d3.rollups(
	// 	data,
	// 	(v) => v.length,
	// 	(d) => d.datetime.toLocaleString('en', { dayPeriod: 'short' })
	// );
	// $: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
	// $: console.log(workByPeriod);
	// $: console.log(maxPeriod);

	// Convert elements of array to values of an objet
	// see: https://piccalil.li/blog/a-guide-to-destructuring-in-javascript/?utm_source=tldrwebdev
	// const myArray = [true, false];
	// const myObject = { ...myArray };
	// console.log(myArray, ' --> ', myObject);

	// $: console.log(
	// 	`MAX Files: `,
	// 	groupByFiles.map((f) => f[1].length)
	// );

	// Max number of lines ∆d for a file
	// $: maxFileLength = d3.rollups(data, v => d3.max(v.file.length),d => d.file)
	// $: console.log(`maxFileLength: `, maxFileLength)
	$: myMax = d3.max(groupByFiles, (d) => d[1].length);
	$: myMin = d3.min(groupByFiles, (d) => d[1].length);
	$: meanLength = Math.round(d3.mean(groupByLength, (d) => d[0]) * 10) / 10;
	// $: console.log(meanLength);

	// ********** SCATTERPLOT ********** //

	// ++++++ DIMENSIONS ++++++ //
	let width = 1000;
	let height = 600;

	let margin = { top: 10, right: 10, bottom: 30, left: 20 };

	let usableArea = {
		top: margin.top,
		right: width - margin.right,
		bottom: height - margin.bottom,
		left: margin.left
	};
	usableArea.width = usableArea.right - usableArea.left;
	usableArea.height = usableArea.bottom - usableArea.top;

	// ++++++ SCALES ++++++ //
	$: console.log(d3.extent(data, (d) => d.datetime));
	$: xScale = d3
		.scaleTime()
		// .scaleUtc()
		.domain(d3.extent(data, (d) => d.datetime))
		.range([usableArea.left, usableArea.right])
		.nice();
	$: yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);

	// ++++++ AXES ++++++ //
	let xAxis, yAxis;
	let yAxisGridlines;

	$: {
		d3.select(xAxis).call(d3.axisBottom(xScale));
		d3.select(yAxis).call(
			d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00')
		);
	}

	// [NB] It's the TICK_SIZE function that renders the multiple lines (default = ??)
	$: d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
</script>

<dl class="stats">
	<div class="data-group">
		<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
		<dd>{data.length}</dd>
	</div>

	<div class="data-group">
		<dt>Total commits</dt>
		<dd>{commits.length}</dd>
	</div>

	<div class="data-group">
		<dt>Total files</dt>
		<dd>{groupByFiles.length}</dd>
	</div>

	<div class="data-group">
		<dt>File length range</dt>
		<dd>{myMin} - {myMax}</dd>
	</div>

	<div class="data-group">
		<dt>Mean length</dt>
		<dd>{meanLength}</dd>
	</div>
</dl>

<h3>Commits by time of day</h3>
<!-- {#each commits as {hourFrac, datetime}}
	<h2>
		cx={datetime}
		cy={hourFrac}
</h2>
{/each} -->
<svg viewBox="0 0 {width} {height}">
	<!-- AXES -->
	<g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />

	{#each xScale.ticks() as tickValue, idx}
		<g transform={`translate(${xScale(tickValue)},10)`}>
			<line
				y2={usableArea.bottom}
				stroke={idx % 4 === 0 ? 'orange' : 'green'}
				stroke-width={idx % 4 === 0 ? '1' : '1.5'}
				stroke-opacity={0.35}
			/>
			<!-- <text
				text-anchor="middle"
				dy=".71em"
				y={usableArea.bottom + 8}
				fill={idx % 4 === 0 ? 'orange' : 'yellow'}
				font-size=0.75rem
			>
				{tickValue.toDateString().slice(0, 3)}
				{tickValue.toDateString().slice(7, 10)}
			</text> -->
		</g>
	{/each}

	<g transform={`translate(${usableArea.left},0)`} bind:this={yAxis} />
	<g class="myX" transform={`translate(0,${usableArea.bottom})`} bind:this={xAxis} />

	<g class="dots">
		{#each commits as { hourFrac, datetime }}
			<circle cx={xScale(datetime)} cy={yScale(hourFrac)} r={5} fill="steelblue" />
		{/each}
	</g>
</svg>

<!-- <ul>
	{#each commits as c, idx}
		<li>
			{idx + 1}: {c[0]} ({c[1].length})
		</li>
	{/each}
</ul> -->

<style>
	svg {
		/* background-color: rgb(46, 46, 46); */
		overflow: visible;
	}

	/* 
		Do not use .gridlines line, .gridlines .tick line 
		or any other descendant selector to style the lines: 
		Svelte thinks it’s unused CSS and removes it!
  */

	.gridlines {
		opacity: 0.15;
	}

	/* .gridlines :global {
		line {
			stroke-opacity: 0.15;
		}
		text {
			color: #a73131;
		}
	} */

	.stats {
		margin-top: 30px;
		display: flex;
		justify-content: space-between;
		border: 1px solid #555;
		border-radius: 3px;
		padding: 1rem;
	}

	.data-group {
		display: flex;
		flex-direction: column;
		/* text-align: right; */
		margin: 10px;
	}

	dd {
		color: #a73131;
		font-size: 2em;
		font-weight: 100;
		margin: 0 auto;
	}

	ul {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}
</style>
