<script>
	let { project, hLevel = 2 } = $props();

	// export let project = {};
	// const { title, image, description } = projects;
</script>

<!-- see: https://www.joshwcomeau.com/css/has/?from=newsletter -->
<!-- <div class="bento-card">
	<p>
		I'm
		<button>183cm</button>
		tall.
	</p>
</div> -->

<!-- ** Use display: grid (4 rows?) to push date flush to bottom -->
<article>
	<!-- see: https://vis-society.github.io/labs/4/ -->
	<svelte:element this={'h' + hLevel}>{project?.title}</svelte:element>
	<img src={project?.image} alt="" />
	<div id="desc-and-date">
		<p class="cut-off">{project?.description}</p>
		<div id="expand-and-date">
			<!-- see: https://www.youtube.com/watch?v=OhCzEjXvY9A -->
			<input class="expand-btn" type="checkbox" name="expand-btn" id="expand-btn" />
			<p id="date">c. {project?.year}</p>
		</div>
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

	/* Common number of lines #1 */
	/* .cut-off {
		--max-lines: 3;

		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--max-lines);
		line-clamp: var(--max-lines);
	} */

	/* Common number of lines #2 */
	.cut-off {
		--max-lines: 4;
		--line-height: 1.4;

		max-height: calc(var(--max-lines) * 1em * var(--line-height));
		line-height: var(--line-height);

		overflow: hidden;
		position: relative;
	}
	.cut-off::before {
		content: '';
		position: absolute;
		height: calc(1em * var(--line-height));
		width: 100%;
		bottom: 0;
		pointer-events: none;
		background: linear-gradient(to bottom, transparent, rgb(28, 28, 28));
	}

	.expand-btn {
		appearance: none;
		border: 1px solid var(--color-accent);
		padding: 0.5em;
		border-radius: 0.25em;
		cursor: pointer;
		margin: 1em;
	}
	.expand-btn:hover {
		background-color: #ccc;
	}
	.expand-btn::before {
		content: 'Expand';
	}
	.expand-btn:checked:before {
		content: 'Collapse';
	}
	.cut-off:has(+ .expand-btn:checked) {
		/* color: red; */
		max-height: none;
	}

	/* Align both 'Expand' btn and date on last line */
	#expand-and-date {
		display: flex;
		justify-content: space-between;
	}

	#desc-and-date {
		display: grid;
		/* align dates evenly along bottom of card */
		grid-template-rows: 1fr;
	}

	#date {
		font-variant-numeric: oldstyle-nums;
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-style: oblique;
		display: grid;
		grid-template-rows: subgrid;
		justify-content: end;
		align-content: end;
	}

	/* see: https://www.joshwcomeau.com/css/has/?from=newsletter */
	.bento-card:has(button:focus-visible) {
		outline: 2px solid var(--color-primary);
	}

	/* Remove the default button focus outline */
	.bento-card button {
		outline: none;
	}

	/* @supports selector(:has(*)) {
		.bento-card:has(button:focus-visible) {
			outline: 2px solid var(--color-primary);
		}

		.bento-card button {
			outline: none;
		}
	} */
	@supports selector(:has(*)) {
		.bento-card:has(button:focus-visible) {
			outline: 2px solid var(--color-accent);
		}

		.bento-card button {
			outline: none;
		}
	}
</style>
