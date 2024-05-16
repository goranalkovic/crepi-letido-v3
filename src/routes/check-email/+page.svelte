<script>
	// @ts-nocheck
	import Send from 'lucide-svelte/icons/send';
	import ChefHat from 'lucide-svelte/icons/chef-hat';
	import * as Card from '$lib/components/ui/card';
	import { Button } from "$lib/components/ui/button"
	import { Separator } from "$lib/components/ui/separator"
</script>

<svelte:head>
	<title>Još malo pa ste z nami! | ČL</title>
</svelte:head>

<div class="flex flex-col items-center gap-2 m-auto">
	<h1 class="flex items-center mb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
		<ChefHat class="mr-2 text-primary size-12 " />
		Črepi letido
	</h1>

	<Card.Root class="max-w-md text-center">
		<Card.Header class="py-10">
			<Send class="mx-auto text-slate-400 size-16 dark:text-slate-600" />
			<Card.Title class="text-2xl md:text-3xl">Nekaj bu od ovog!</Card.Title>
			<Card.Description class="text-lg">Na pola puta smo!</Card.Description>
		</Card.Header>
		<Separator />
		<Card.Content class="p-6">
			Na mejla ti bu došel jedan link kojim se bu završil proces prijave. Klikni na njega, ne bu ti nikaj (valjda).
		</Card.Content>
	</Card.Root>

	<p class="text-xs text-muted-foreground">Ovo se bu samo zaprlo za 2-3 sekunde. Ak se ne zapre, klikni <Button class="p-0" href="/" variant="link">tuj</Button>.</p>



</div>
