<script>
	//
</script>

<svelte:head>
	<title>Contact me</title>
</svelte:head>

<h1>Contact</h1>

<!-- mailto... https://github.com/brave/brave-browser/issues/20555 -->
<form action="mailto:iquacalc@gmail.com" method="POST" enctype="text/plain">
	<label class="">
		email
		<input
			type="text"
			name="email"
			id="email"
			value="iquacalc@gmail.com"
			placeholder="Enter email"
		/>
	</label>

	<label class="">
		Subject
		<input type="text" name="subject" id="subject" value="Yadda" placeholder="Enter Subject" />
	</label>

	<label for="">
		Message
		<textarea name="body" contt="'234567" placeholder="Enter message"></textarea>
	</label>

	<button type="submit">Submit</button>

	<a href="mailto:iquacalc@gmail.com">Email Us</a>
</form>

<style>
	label {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
	}
</style>
