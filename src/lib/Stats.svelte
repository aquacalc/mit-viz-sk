<script>
	export let data;
	export let linesMedian;
	export let linesMax;
	export let numFiles;
	console.log(`DATA: `, data);
</script>

<section class="git-hub-data">
	<!-- <h3>Codebase stats for Commit No. {data[0].commit}</h3> -->
	<dl>
		<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
		<dd>{data.length}</dd>

		<dt>Lines <abbr title="Median lines of code">Median</abbr></dt>
		<dd>{linesMedian}</dd>

		<dt>Lines <abbr title="Max lines of code">max</abbr></dt>
		<dd>{linesMax}</dd>

		<dt>num Files <abbr title="Lines of code">LOC</abbr></dt>
		<dd>{numFiles}</dd>
	</dl>
</section>

<style>
	dt {
		font-weight: bold;
	}

	dl {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	dl,
	dd {
		font-size: 0.9rem;
	}

	dt {
		grid-row: 1;
		padding-left: 0.5rem;
		font-size: 0.8rem;
		font-weight: 400;
		text-transform: uppercase;
		color: #aaa;
	}

	dd {
		grid-row: 2;
		margin-left: 0.5em;
		font-size: 2rem;
		font-weight: 100;
		color: #aaeeeeee;
	}

	.git-hub-data {
		border: 0.5px solid #555;
		width: 80%;
		margin: 0 auto;
	}
	.git-hub-data h3 {
		padding-left: 0.5rem;
		font-weight: 200;
	}
</style>
