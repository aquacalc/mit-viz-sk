export const load = async ({ fetch }) => {
	const res = await fetch('https://api.github.com/users/leaverou');

	const data = await res.json();

	return {
		data
	};
};
