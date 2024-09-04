<script>
	import projects from '$lib/projects.json';

	import Project from '$lib/components/Project.svelte';

	// console.log('--> ', projects)
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<div class="projects">
	{#each projects as project}
		<Project {project} />
		<!-- {#each projects as { title, description, image }} -->
		<!-- <article>
			<h2>{title}</h2>
			<img src={image} alt="" />
			<p>{description}</p>
		</article> -->
	{/each}
</div>
