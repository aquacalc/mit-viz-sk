<script>
	import { page } from '$app/stores';
	import '$lib/styles/styles.css';

	$: currentPage = $page.url.pathname;

	// let currentTheme = 'light dark';

	let localStorage = globalThis.localStorage ?? {};

	let currentTheme = localStorage.colorScheme ?? 'light dark';

	let root = globalThis?.document?.documentElement;
	$: root?.style.setProperty('color-scheme', currentTheme);
  
  $: localStorage.colorScheme = currentTheme;


	const handleTheme = (e) => {
		currentTheme = e.target.value;
		localStorage.setItem('colorScheme', e.target.value);
		// document.documentElement.style.setProperty('color-scheme', e.target.value);
	};
</script>

<label class="color-scheme">
	Theme:
	<select id="select-theme" bind:value={currentTheme} onchange={handleTheme}>
		<option value="light dark">Automatic</option>
		<option value="light">light</option>
		<option value="dark">dark</option>
	</select>
</label>

<nav>
	<ul>
		<li>
			<a class={currentPage === '/' ? 'current' : null} href="/">Home</a>
		</li>
		<li>
			<a class={currentPage === 'mit-viz-sk/projects' ? 'current' : null} href="/projects">Projects</a>
		</li>
		<li>
			<a class={currentPage === '/contact' ? 'current' : null} href="/contact"> Contact </a>
		</li>
	</ul>
</nav>

<slot />

<style>
	nav {
		display: flex;
		/* gap: 1em; */
		margin-bottom: 0.5rem;
		border-bottom: 1px solid oklch(80% 3% 200);
		border-bottom-color: oklch(50% 10% 200 / 40%);
	}

	ul {
		display: contents;
		/* list-style: none; */
	}
	li {
		display: contents;
	}
	li a {
		text-decoration: none;
		color: inherit;
		padding: 0.5em;
		text-align: center;
		/* flex-grow : 1;    ➜ The div will grow in same proportion as the window-size       
     flex-shrink : 1;  ➜ The div will shrink in same proportion as the window-size 
     flex-basis : 0;   ➜ The div does not have a starting value as such and will 
                     take up screen as per the screen size available for
                     e.g:- if 3 divs are in the wrapper then each div will take 33%. */
		flex: 1;
	}

	nav a {
		text-decoration: none;
		color: inherit;
		padding: 0.5em;
		text-align: center;
		/* flex-grow : 1;    ➜ The div will grow in same proportion as the window-size       
     flex-shrink : 1;  ➜ The div will shrink in same proportion as the window-size 
     flex-basis : 0;   ➜ The div does not have a starting value as such and will 
                     take up screen as per the screen size available for
                     e.g:- if 3 divs are in the wrapper then each div will take 33%. */
		flex: 1;
	}

	.current {
		border-bottom: 0.4em solid oklch(80% 3% 200);
		padding: 0.5em;
	}
	.current:hover {
		border-bottom-color: var(--color-accent);
		/* background-color: oklch(from var(--color-accent) 95% 5% h); */
		background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	label {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
	}

	select {
		font-size: 80%;
	}

	.color-scheme {
		display: flex;
		gap: 0.5em;
		justify-content: end;
	}
</style>
