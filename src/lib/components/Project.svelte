<script>
	// import projects from '../projects.json';

	// export let project = {};
	let { project } = $props();

	// const { title, image, description } = projects;
</script>

<article>
	<h2>{project?.title}</h2>
	<img src={project?.image} alt="" />
	<p>{project?.description}</p>
</article>
