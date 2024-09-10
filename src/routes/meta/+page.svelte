<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	import Stats from '$lib/Stats.svelte';

	let data = [];
	let commits = [];
	// let commitsBis = [];

	onMount(async () => {
		data = await d3.csv('loc.csv', d3.autoType);

		// see: https://vis-society.github.io/labs/7/#fn:eachcommit
		commits = d3
			.groups(data, (d) => d.commit)
			.map(([commit, lines]) => {
				let first = lines[0];
				let { author, date, time, timezone, datetime } = first;
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

		// commitsBis = d3
		// 	.groups(data, d => d.commit)
		// 	.map(([key, value]) => ({
		// 		key,
		// 		value
		// 	}))
	});

	$: linesMedian = d3.median(data, d => d.line)
	$: linesMax = d3.max(data, d => d.line)
	$: numFiles = d3.groups(data, d => d.file).length
	$: console.log(`data: `, data[4]);
	// $: console.log(`commitsBis: `, commitsBis.slice(0, 2));
	$: console.log(`commits: `, commits.slice(0, 2));
	// $: console.log(d3.min(data, d => d.line))
	// $: console.log(d3.max(data, d => d.line))
	// $: console.log(d3.median(data, d => d.line))
	// $: console.log(numFiles)
</script>

<h1>Meta</h1>
<p>codebase stats</p>

<Stats {data} {linesMedian} {linesMax} {numFiles} />

<!-- <p>Total lines of code: {data.length}</p> -->



<style>
	/*  */
</style>
