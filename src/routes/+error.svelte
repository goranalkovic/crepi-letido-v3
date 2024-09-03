<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import ChefHat from 'lucide-svelte/icons/chef-hat';
	import CandyOff from 'lucide-svelte/icons/candy-off';
	import TextSelect from 'lucide-svelte/icons/text-select';
	import House from 'lucide-svelte/icons/house';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
</script>

<svelte:head>
	<title>Jao, šta bi? ({$page.status}) | ČL</title>
</svelte:head>

<div class="flex flex-col items-center w-full max-w-lg gap-2 m-auto">
	<h1 class="flex items-center mb-8 text-4xl font-bold tracking-tight lg:text-5xl">
		<ChefHat class="mr-2 text-primary size-12 " />

		{#if $page.status === 404}
			Črepi letido
		{:else}
			Črepi... ne letido?
		{/if}
	</h1>

	<Card.Root class="w-full max-w-md text-center">
		<Card.Header class="pt-10 pb-8">
			{#if $page.status === 404}
				<TextSelect class="mx-auto text-primary size-16" />
			{:else}
				<CandyOff class="mx-auto text-primary size-16" />
			{/if}

			<Card.Title class="text-2xl md:text-3xl">
				{#if $page.status === 404}
					Otkud ti ovaj link?<br />Tu nema nič.
				{:else}
					Auf, nekaj je crklo
				{/if}
			</Card.Title>
			<Card.Description class="text-lg"><span class="font-mono">{$page.status}</span></Card.Description>
		</Card.Header>
		<Separator />
		<Card.Content class="flex flex-col items-center gap-6 p-6 text-base">
			{#if $page.status !== 404}
				A niš, probaj opet ili se javi Gocu, znal bu on kaj treba.
			{/if}

			<Button href="/" size="lg"><House class="mr-2 size-5" /> Vrni me doma</Button>
		</Card.Content>
	</Card.Root>

	<p class="mt-4 text-xs text-muted-foreground/25">Greška: {$page.error.message}</p>
</div>
