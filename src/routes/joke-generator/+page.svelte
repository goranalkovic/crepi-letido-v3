<script>
	import Laugh from 'lucide-svelte/icons/laugh';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let quote = $state('Ovo je placeholder za quote hehe #lazyDev. Klik bude dao qute tho, tak da kaj se čeka?');

	const crepQuotes = ['Črepi, črepi letido!', 'Ono.', 'Tornado bu, jebote.', 'Isusa ti! Se trga!', 'Alo! Nejdi, črepi letido.'];

	const getRandom = () => {
		quote = crepQuotes[Math.floor(Math.random() * crepQuotes.length)];
	};
</script>

<div class="w-full max-w-lg m-auto space-y-4">
	<Laugh class="mx-auto size-20 accent-current animate-spin" />

	<Card.Root class="text-center">
		<Card.Header>
			<Card.Title tag="h2">Črep-quote generator</Card.Title>
			<Card.Description>A ja mislaaaaaa jaoooooooo</Card.Description>
		</Card.Header>
		<Card.Content>
			<blockquote class="flex items-center h-24 pl-6 italic border-l-2 text-start text-balance">
				"{quote}"
			</blockquote>
		</Card.Content>
		<Card.Footer>
			<Button class="mx-auto" size="lg" on:click={getRandom}>Get a Črep quote</Button>
		</Card.Footer>
	</Card.Root>
</div>
