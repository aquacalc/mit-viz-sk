<script>
	import { page } from '$app/stores';

	// see: https://joshcollinsworth.com/blog/sveltekit-page-transitions#the-final-code
	import { fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import '$lib/styles/styles.css';

	export let data;

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

	// ** ------------------- ** //

	// const rootEl = typeof document !== 'undefined' ? document.documentElement : null;
	// const themes = ['light', 'dark'];
	// let theme = 'dark';

	// if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
	//   theme = localStorage.getItem('theme');
	// } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	//   theme = 'dark';
	// }

	// function handleChange(event) {
	//   theme = event.target.value;
	//   localStorage.setItem('theme', theme);
	// }

	// $: if (rootEl && theme === 'light') {
	//   rootEl.classList.remove('theme-dark');
	// } else if (rootEl && theme === 'dark') {
	//   rootEl.classList.add('theme-dark');
	// }

	// 	:root {
	//   --background-body: #fff;
	//   --background-body-accent: #f5fbfd; /* if use linear gradient */
	//   /* --background-body: #fff; */ /* original */
	//   --text-main: #36393b;
	//   --text-secondary: #6b6f72;
	//   --primary-color: #548e9b;
	//   --font-family-serif: Merriweather, serif;
	//   --font-family-sans: "Fira Sans", sans-serif;
	//   /* Added light/dark colors for CO2-Alk WQ Playground */
	//   --wqmap-axis-text: #5a5a5a;
	//   --test-text-playground: #5a5a5a;
	//   --wq-playground-heading: rebeccapurple;
	//   --target-icon-playground: rebeccapurple;
	//   --fixed-icon-playground: rgb(27, 103, 217);
	//   --target-border-playground: rgba(102, 51, 153, 0.85);
	//   --card-background: #fbfaf8;
	//   --card-background-qin: #fff;
	//   --water-color-top: #6eaef2;
	//   --water-color-bottom: #0b395d;
	//   --blue-for-bicarb-text: blue;
	//   --amt-rgt-added: rebeccapurple;
	//   --rgt-green: green;
	//   --rgt-blue: blue;
	//   /* ABOUT -- dark mode */
	//   --about-text-highlight: rebeccapurple;
	//   /* Connor Rothschild */
	//   --primary-color-rgb: rgba(247, 247, 247, 0.65); /* originally 215, 125, 215 */
	//   --accent-color-rgb: rgba(41, 89, 180, 0.65);
	// }
	// /* linear-gradient(to bottom right,rgba(var(--primary-color-rgb),1) 20%,rgb(var(--accent-color-rgb),1) 200%); */

	// :root.theme-dark {
	//   /* --background-body: hsl(212deg, 9%, 22%); */
	//   --background-body: #202122;
	//   --background-body-accent: #1e364f; /* if use linear gradient */
	//   /* --background-body: hsl(212deg, 9%, 22%); */
	//   /* --background-body-accent: hsl(212deg, 9%, 22%); */ /* if use linear gradient */
	//   --text-main: #fff;
	//   --text-secondary: #ccc;
	//   --primary-color: #548e9b;
	//   /* Added light/dark colors for CO2-Alk WQ Playground */
	//   /* --wqmap-axis-text: lightyellow; */
	//   /* --wqmap-axis-text: #5a5a5a; */
	//   --test-text-playground: #949494;
	//   --wq-playground-heading: #a68ac1;
	//   /* --target-icon-playground: #ebbf97;
	//   --fixed-icon-playground: rgba(234, 233, 232, 0.85);
	//   --target-border-playground: rgb(236, 193, 113); */
	//   --card-background: #2b3036;
	//   --card-background-qin: #2b3036;
	//   --water-color-top: #8bccfb;
	//   --water-color-bottom: #0b395d;
	//   --blue-for-bicarb-text: #7979fb;
	//   --rgt-blue: #7979fb;
	//   /* --amt-rgt-added: #f6f2cf; */
	//   /* --rgt-green: #75ff75;
	//   --rgt-blue: #acacff; */
	//   /* --blue-for-bicarb-text: blue;
	//   --amt-rgt-added: rebeccapurple;
	//   --rgt-green: green;
	//   --rgt-blue: blue; */
	//   /* ABOUT -- dark mode */
	//   --about-text-highlight: #ebbf97;
	//   --about-border: rgb(236, 193, 113);
	//   /*  */
	//   --primary-color-rgb: #202122;
	//   --accent-color-rgb: #202122;
	// }

	// ** ------------------- ** //
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
			<a class={currentPage === '/projects' ? 'current' : null} href="/projects">Projects</a>
		</li>
		<!-- <li>
			<a class={currentPage === '/meta' ? 'current' : null} href="/meta">Meta Data</a>
		</li> -->
		<li>
			<a class={currentPage === '/meta-scrolly' ? 'current' : null} href="/meta-scrolly"
				>Meta Scrolly</a
			>
		</li>
		<li>
			<a class={currentPage === '/contact' ? 'current' : null} href="/contact"> Contact </a>
		</li>
	</ul>
</nav>

{#key data.pathname}
	<div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
		<!-- <div
		in:fade={{ easing: cubicOut, duration: 300, delay: 400 }}
		out:fade={{ easing: cubicIn, duration: 300 }}
	> -->
		<slot />
	</div>
{/key}

<style>
	nav {
		display: flex;
		/* gap: 1em; */
		margin-bottom: 0.5rem;
		border-bottom: 1px solid oklch(80% 3% 200);
		border-bottom-color: oklch(50% 10% 200 / 40%);

		/* position: sticky; */
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
