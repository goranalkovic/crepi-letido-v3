<script>
	// @ts-nocheck

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	import Vegan from 'lucide-svelte/icons/vegan';
	import Phone from 'lucide-svelte/icons/phone';
	import Truck from 'lucide-svelte/icons/truck';
	import BookMarked from 'lucide-svelte/icons/book-marked';
	import Handshake from 'lucide-svelte/icons/handshake';
	import CloudRainWind from 'lucide-svelte/icons/cloud-rain-wind';
	import Sticker from 'lucide-svelte/icons/sticker';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import PartyPopper from 'lucide-svelte/icons/party-popper';
	import RouteOff from 'lucide-svelte/icons/route-off';
	import Hourglass from 'lucide-svelte/icons/hourglass';
	import Atom from 'lucide-svelte/icons/atom';
	import TicketCheck from 'lucide-svelte/icons/ticket-check';

	let { name, slug, phone, delivery, url, urlType, className } = $props();
</script>

<Card.Root class="min-w-96 {className}">
	<Card.Header>
		<Card.Title class="flex items-center gap-2 mb-3">
			<img class="size-6" src="/restaurant-icons/{slug}.png" alt={name} />
			{name}
		</Card.Title>
		{#if phone}
			<Card.Description class="flex items-center gap-3">
				<Phone class="size-5 accent-current" />
				{phone}
			</Card.Description>
		{/if}
		{#if delivery}
			<Card.Description class="flex items-center gap-3">
				<Truck class="size-5 accent-current" />
				{delivery}
			</Card.Description>
		{/if}

		{#if url}
			<Card.Description class="flex items-center gap-3 pt-3">
				<BookMarked class="size-5 accent-current" />

				<Button variant="link" class="h-auto p-0" href={url} target="_blank">
					{#if urlType === 'additional'}
						Dodatna ponuda
					{:else}
						Meni
					{/if}
				</Button>
			</Card.Description>
		{/if}
	</Card.Header>
</Card.Root>
