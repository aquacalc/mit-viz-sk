<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let data = [];

	onMount(async () => {
		data = await d3.csv('loc.csv');

		data = d3.groups(data, d => d.commit)
	});

	$: console.log(`DATA: `, data);
</script>

<h2>No. Commits: {data.length}</h2>

<style>
	/*  */
</style>
