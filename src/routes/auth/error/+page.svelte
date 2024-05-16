<script>
	import ShieldX from 'lucide-svelte/icons/shield-x';
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Greška kod prijave | ČL</title>
</svelte:head>

<Card.Root class="w-full max-w-md m-auto text-center">
	<Card.Header class="py-10">
		<ShieldX class="mx-auto text-destructive size-16 " />
		<Card.Title class="text-2xl md:text-3xl">Nekaj je crklo</Card.Title>
		<Card.Description class="text-lg">Vrag te odnio, pa kud baš usred prijave!</Card.Description>
	</Card.Header>
</Card.Root>