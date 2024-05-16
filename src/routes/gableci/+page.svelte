<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import Vegan from 'lucide-svelte/icons/vegan';
	import Phone from 'lucide-svelte/icons/phone';
	import Truck from 'lucide-svelte/icons/truck';
	import BookMarked from 'lucide-svelte/icons/book-marked';
	import Handshake from 'lucide-svelte/icons/handshake';
	import CloudRainWind from 'lucide-svelte/icons/cloud-rain-wind';
	import Sticker from 'lucide-svelte/icons/sticker';

	import { slide, scale, blur } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Alert from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';

	let { data } = $props();
	let { supabase, possibleSelections, hasError, displayedRestaurants, numPeoplePicked } = $derived(data);

	$effect(() => {
		const mealSelectionsChannel = supabase
			.channel('resultsMealSelectionSub')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'meal-selections' }, async () => await invalidateAll())
			.subscribe();

		const restaurantDataChannel = supabase
			.channel('resultsRestaurantDataSub')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, async () => await invalidateAll())
			.subscribe();

		return () => {
			supabase.removeChannel(mealSelectionsChannel);
			supabase.removeChannel(restaurantDataChannel);
		};
	});

	$effect(() => {
		invalidateAll();
	});
</script>

<svelte:head>
   <title>Gablec overview | ČL</title>
</svelte:head>

{#if hasError}
	<Alert.Root>
		<Alert.Title>Nekaj se zblesiralo.</Alert.Title>
		<Alert.Description>Bude bolje zutra.</Alert.Description>
	</Alert.Root>
{/if}

{#if displayedRestaurants?.length < 1}
	<Card.Root class="w-full max-w-md m-auto text-center">
		<Card.Header class="py-10">
			<CloudRainWind class="mx-auto text-slate-400 size-16 dark:text-slate-600" />
			<Card.Title class="text-2xl md:text-3xl">Črepi nisu sletili... još</Card.Title>
			<Card.Description class="text-lg">Valjda bu netko nekaj izabral</Card.Description>
		</Card.Header>
		<Separator />
		<Card.Content class="p-6">
			<Button href='/gableci/pick'>
				<Sticker class="mr-2 size-5" />
				Kaj se čeka?
			</Button>
		</Card.Content>
	</Card.Root>
{/if}

{#each displayedRestaurants as { id, meals, restaurant: { name, phone, slug, url, delivery, urlType }, statistics: { totalMealsOrdered, hasIntersect } } (id)}
	<div class="flex gap-8 pb-4" transition:scale={{ start: 0.95 }} animate:flip={{ duration: 500 }}>
		<Card.Root class="sticky self-start min-w-96 top-8">
			<Card.Header>
				<Card.Title class="flex items-center gap-2 mb-3">
					<img class="size-6" src="/restaurant-icons/{slug}.png" alt={name} />
					{name}
					{totalMealsOrdered}
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

		<div class="space-y-1.5 w-full max-w-2xl p-1 rounded-lg border transition-colors {hasIntersect && numPeoplePicked > 1 ? 'border-primary/25 bg-gradient-to-br from-primary/5 to-primary/0' : 'border-transparent'}">
			{#if hasIntersect && numPeoplePicked > 1}
				<p transition:scale={{ start: 0.85 }} class="w-fit flex items-center gap-1 px-2 text-base font-semibold py-1.5 bg-gradient-to-tr from-primary to-primary/75 text-primary-foreground rounded-md">
					<Handshake class="size-6" />
					Intersect
				</p>
			{/if}

			{#each meals as { name, price, meta }, i (i)}
				{#if possibleSelections[slug][i].selected.length > 0}
					<div transition:slide class="flex items-center w-full p-2 space-x-3 transition duration-700 rounded-lg">
						<div class="space-y-1.5 w-full text-sm font-medium leading-none mx-w-lg">
							<p>
								{name}
								{#if meta?.isVegetarian}
									<Vegan class="inline-block ml-1 size-4 text-lime-600 dark:text-lime-600" />
								{/if}
							</p>
							{#if price}
								<p class="text-muted-foreground">{price}</p>
							{/if}
						</div>
						<div class="flex -space-x-4 hover:space-x-1">
							{#each possibleSelections[slug][i].selected as currentUser (currentUser.email)}
								<div animate:flip transition:scale class="transition-[margin] leading-[0]">
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Avatar.Root class="border-2 size-9 border-secondary dark:border-background bg-background">
												<Avatar.Image src="/profile-pictures/{currentUser.avatar}.jpg" alt="{currentUser.firstName ?? ''} {currentUser.lastName ?? ''}" />
												<Avatar.Fallback>{currentUser.firstName?.charAt(0) ?? '-'}{currentUser.lastName?.charAt(0) ?? '-'}</Avatar.Fallback>
											</Avatar.Root>
										</Tooltip.Trigger>
										<Tooltip.Content>
											<p>
												{currentUser?.firstName}
												{currentUser?.lastName}
											</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/each}
