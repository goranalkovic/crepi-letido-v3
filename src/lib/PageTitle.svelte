<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	import Tornado from 'lucide-svelte/icons/tornado';
	import Laugh from 'lucide-svelte/icons/laugh';
	import Settings from 'lucide-svelte/icons/settings';
	import Utensils from 'lucide-svelte/icons/utensils';
	import ListChecks from 'lucide-svelte/icons/list-checks';
	import Vote from 'lucide-svelte/icons/vote';

	let currentRoute = $derived($page.url.pathname);

	const navbarHiddenRoutes = ['/', '/auth', '/check-email'];
</script>

{#if !navbarHiddenRoutes.includes(currentRoute)}
	<aside class="sticky top-0 z-10 flex items-center h-16 p-6 border-b ml-14 bg-background" transition:slide>
		<h1 class="flex items-center text-3xl font-bold tracking-tight">
			{#if currentRoute === '/gableci/pick'}
				<Utensils class="mr-3 text-primary size-8" />
				Gablec picker
			{:else if currentRoute === '/gableci'}
				<ListChecks class="mr-3 text-primary size-8" />
				Gablec overview
			{:else if currentRoute === '/gableci/vote'}
				<Vote class="mr-3 text-primary size-8" />
				Final vote &nbsp; <span class="text-md font-medium opacity-30 uppercase">beta</span>
			{:else if currentRoute === '/crep-storm'}
				<Tornado class="mr-3 text-primary size-8" />
				Črep-storm™
			{:else if currentRoute === '/joke-generator'}
				<Laugh class="mr-3 text-primary size-8" />
				Budišin kutak
			{:else if currentRoute === '/settings'}
				<Settings class="mr-3 text-primary size-8" />
				Postavke
			{/if}
		</h1>
	</aside>
{/if}
