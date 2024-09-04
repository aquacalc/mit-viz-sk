<script>
	import projects from '$lib/projects.json';
	import Project from '$lib/components/Project.svelte';
</script>

<svelte:head>
	<title>MIT Viz - Home</title>
</svelte:head>

<h1>MIT Viz & Society 2024</h1>
<p>
	<a href="https://vis-society.github.io/" target="_blank">online course here</a>
</p>

<h2>Most visited posts</h2>
<div class="projects">
	{#each projects.slice(0, 3) as project}
		<!-- {#each projects.filter((p, idx) => idx < 3) as project} -->
		<Project {project} hLevel={3} />
	{/each}
</div>

<div class="img-div">
	<img src="./images/_Lav.jpg" alt="slika 'Lav' na Buži" style="max-width: 200px;" />
</div>

<p>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum repellendus qui ut nobis incidunt
	debitis soluta nisi animi ducimus vel doloribus, id tenetur aliquid in inventore, harum,
	necessitatibus dolor eos?
</p>
