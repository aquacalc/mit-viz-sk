<script>
	import * as d3 from 'd3';
	import projects from '$lib/projects.json';

	import Project from '../../lib/components/Project.svelte';
	import Pie from '$lib/components/d3js/Pie.svelte';

	let query = '';

	let filteredProjects = [];
	let filteredProjectsAll = [];
	let x = [];
	let myPieData = [];

	$: {
		// Filter TITLE
		filteredProjects = projects.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()));

		// Filter ALL
		filteredProjectsAll = projects.filter((d, idx) =>
			Object.values(d).join('\n').toLowerCase().includes(query.toLowerCase())
		);

		x = d3.rollups(
			// filteredProjects,
			filteredProjectsAll,
			(n) => n.length,
			(d) => d.year
		);

		myPieData = x.map(([label, value]) => ({ label, value })).sort((a, b) => a.label - b.label);
	}
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

{#if query === ''}
	<h1 class="num-projects">
		{filteredProjectsAll.length} Project{filteredProjectsAll.length === 1 ? '' : 's'}
	</h1>
{:else}
	<h1 class="num-projects">
		{filteredProjectsAll.length} Project{filteredProjectsAll.length === 1 ? '' : 's'} include{filteredProjectsAll.length ===
		1
			? 's'
			: ''} "{query.toLowerCase()}"
	</h1>
{/if}

<label for="query">
	Search:
	<input type="search" name="query" id="query" bind:value={query} placeholder="search" />
</label>

{#if filteredProjectsAll.length > 0}
	<Pie {myPieData} />
{:else}
	<div id="sorry">
		<h2>Sorry! No articles include "{query}"</h2>
	</div>
{/if}

<div class="projects">
	{#each filteredProjectsAll as project}
		<Project {project} hLevel={3} />
	{/each}
</div>

<style>
	.num-projects {
		font-weight: 300;
	}

	#sorry {
		margin-top: 5rem;
	}
</style>
