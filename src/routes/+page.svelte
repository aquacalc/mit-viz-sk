<script>
	import projects from '$lib/projects.json';
	import Project from '$lib/components/Project.svelte';

	export let data;

	// const { data } = $props();
	// const { data } = data;

	console.log(`DATA: `, data.data);
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

<!-- see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl -->

<!-- <hr /> -->

<section class='git-hub-data'>
	<h3>Plaque-tournante de Git de {data.data.name}</h3>
	<dl>
		<dt>Following</dt>
		<dd>{data.data.following}</dd>
		<dt>Followers</dt>
		<dd>{data.data.followers}</dd>
		<dt>Public Repos</dt>
		<dd>{data.data.public_repos}</dd>
		<dt>Public Gists</dt>
		<dd>{data.data.public_gists}</dd>
	</dl>
</section>

<!-- <h3>Cryptids of Cornwall:</h3>
<dl>
	<dt>Beast of Bodmin</dt>
	<dd>A large feline inhabiting Bodmin Moor.</dd>

	<dt>Morgawr</dt>
	<dd>A sea serpent.</dd>

	<dt>Owlman</dt>
	<dd>A giant owl-like creature.</dd>
</dl> -->

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
		/* margin-bottom: 1em; */
    /* justify-content: left; */
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
