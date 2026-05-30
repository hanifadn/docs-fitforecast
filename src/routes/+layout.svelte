<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
