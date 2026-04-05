<script lang="ts">
	const { data } = $props();

	const { article } = data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<p>{JSON.stringify(article)}A</p>
