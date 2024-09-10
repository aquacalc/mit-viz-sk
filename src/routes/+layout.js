// see: https://joshcollinsworth.com/blog/sveltekit-page-transitions#the-final-code

export const load = ({ url }) => {
	const { pathname } = url;

	return {
		pathname
	};
};
