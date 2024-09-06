<script>
	let { project, hLevel = 2 } = $props();

	// export let project = {};
	// const { title, image, description } = projects;
</script>

<article>
	<!-- see: https://vis-society.github.io/labs/4/ -->
	<svelte:element this={'h' + hLevel}>{project?.title}</svelte:element>
	<img src={project?.image} alt="" />
	<div>
		<p>{project?.description}</p>
		<p id="date">c. {project?.year}</p>
	</div>
</article>

<style>
	article {
		display: grid;
		grid-template-rows: subgrid;
		grid-row: span 3;
		padding: 0.5em;
	}

	img {
		max-width: 100%;
	}

	#date {
		font-variant-numeric: oldstyle-nums;
    font-family: Georgia, 'Times New Roman', Times, serif;
    display: grid;
		grid-template-rows: subgrid;
    justify-content: end;
    align-content: end;
	}
</style>
