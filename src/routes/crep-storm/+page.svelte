<script>
	import Tornado from 'lucide-svelte/icons/tornado';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let buttonDisabled = $state(false);
</script>

<svelte:head>
	<title>Črep-storm™ | ČL</title>
</svelte:head>

<div class="w-full max-w-lg m-auto space-y-4">
	<Tornado class="mx-auto size-20 accent-current" />

	<Card.Root>
		<Card.Header>
			<Card.Title tag="h2">Coming soon</Card.Title>
			<Card.Description>(kad mi se bude dalo)</Card.Description>
		</Card.Header>
		<Card.Content>Jbg.</Card.Content>
		<Card.Footer>
			<Button class="mx-auto" disabled={buttonDisabled} on:click={() => (buttonDisabled = true)} size="lg">Žali se upravi vodovoda</Button>
		</Card.Footer>
	</Card.Root>
</div>
