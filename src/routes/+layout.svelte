<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex min-h-screen w-screen flex-col items-center justify-between py-6">
	{@render children()}
</main>
