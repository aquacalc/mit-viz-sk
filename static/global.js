// Selecting Elements
// see: https://stackoverflow.com/questions/35682890/double-dollar-vs-dollar-sign-in-chrome-console-behavior
// There are a few shortcuts for selecting elements.
// These save you valuable time when compared to typing out their standard counterparts.

// $() Returns the first element that matches the specified CSS selector. It is a shortcut for document.querySelector().
// $$() Returns an array of all the elements that match the specified CSS selector. This is an alias for document.querySelectorAll()
// $x() Returns an array of elements that match the specified XPath.

// When you use querySelector (or $), the result is an element or null.
// When you use $$, the result isn't an element but an Array which can be easily iterated over.
// This differs from the native querySelectorAll where it returns a NodeList which is slightly harder to go over all the entries.Selecting Elements

// ... ∆ file path from vanilla JS to SK ...
// see: https://vis-society.github.io/labs/4/
// Svelte’s server works: it does not let us add / at the end of URLs
// (note that if you try to go to e.g. http://localhost:5173/projects/
// you will be redirected to http://localhost:5173/projects)
// so every relative URL is interpreted as relative to the same folder.

// The browser doesn’t know anything about your directory structure,
// so it doesn’t know that projects/ is a directory.
// It figures out what is a file and what is a directory entirely from the URL.
// So when you visit something like https://username.github.io/portfolio/projects,
// it will just treat projects as a file in the same directory — a file with no extension.

// This means that if we did want to add subpages (e.g. projects/viz/),
// we would have to do some work to handle this, but let’s cross that bridge when we get to it.
let pages = [
	{ url: './', title: 'Home' },
	{ url: 'projects', title: 'Projects' },
	{ url: 'contact', title: 'Contact' }
	// add the rest of your pages here
];

// Create NAV element
let nav = document.createElement('nav');
document.body.prepend(nav);

// Create SELECT element for light/dark theme
document.body.insertAdjacentHTML(
	'afterbegin',
	`<label class="color-scheme">
  Theme:
		<select id='select-theme'>
			<option value='light dark'>Automatic</option>
			<option value='light'>light</option>
			<option value='dark'>dark</option>
		</select>
	</label>`
);

// When ∆ theme...
//  (1) set new theme in LS
//  (2) ∆ color-scheme property
const selectTheme = document.querySelector('#select-theme');

selectTheme.addEventListener('change', function () {
	// console.log(`Change to ${this.value} (${e.target.value})`);
	localStorage.setItem('colorScheme', this.value);
	document.documentElement.style.setProperty('color-scheme', this.value);
	// document.documentElement.style.setProperty("color-scheme", localStorage.getItem("colorScheme"));
});

if (localStorage.colorScheme) {
	console.log(`Ima: ${localStorage.colorScheme}`);
	document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
	selectTheme.value = localStorage.colorScheme;
}

// const ARE_WE_HOME = document.documentElement.classList.contains("home");

for (let p of pages) {
	let url = p.url;
	let title = p.title;

	// Create link and add it to nav
	// url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;
	// nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);

	let a = document.createElement('a');
	a.href = url;
	a.textContent = title;
	nav.append(a);

	a.host === location.host && a.pathname === location.pathname ? (a.className = 'current') : null;
}

// const navLinks = $$('nav a');

// const myCurrent = navLinks.find((n) => n.className === 'current');

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add("current");

// console.log("navLinks = ", navLinks);
// console.log("nav = ", nav);
// console.log('myCurrent = ', myCurrent.text);
// console.log("currentLink = ", currentLink, currentLink.classList);

// function $$(selector, context = document) {
// 	return Array.from(context.querySelectorAll(selector));
// }
