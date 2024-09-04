<script>
	let { project, hLevel = 2 } = $props();

	// export let project = {};
	// const { title, image, description } = projects;
</script>

<article>
	<!-- see: https://vis-society.github.io/labs/4/ -->
	<svelte:element this={'h' + hLevel}>{project?.title}</svelte:element>
	<img src={project?.image} alt="" />
	<p>{project?.description}</p>
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
</style>
