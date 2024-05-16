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
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import PartyPopper from 'lucide-svelte/icons/party-popper';
	import RouteOff from 'lucide-svelte/icons/route-off';

	import { getCurrentDate } from '$lib/current-date.js';

	import { slide, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Alert from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Popover from '$lib/components/ui/popover';

	let { data } = $props();
	let { supabase, possibleSelections, hasError, displayedRestaurants, numPeoplePicked, user, finalize1DoneUsers, currentUserHasFinalized1 } = $derived(data);

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

	const handleFinalize = async (unlock = false) => {
		const currentDate = getCurrentDate();

		await supabase
			.from('meal-selections')
			.update({
				final: !unlock,
			})
			.eq('user', user.email)
			.gte('created', `${currentDate} 00:00:00`)
			.lte('created', `${currentDate} 23:59:59`);
	};

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
			<Button href="/gableci/pick">
				<Sticker class="mr-2 size-5" />
				Kaj se čeka?
			</Button>
		</Card.Content>
	</Card.Root>
{/if}

{#if !currentUserHasFinalized1}
	{#each displayedRestaurants as { id, meals, restaurant: { name, phone, slug, url, delivery, urlType }, statistics: { intersectBreakers, hasIntersect } } (id)}
		<div class="flex gap-8 pb-8 border-b last:border-b-0" transition:scale={{ start: 0.95 }} animate:flip={{ duration: 500 }}>
			<Card.Root class="sticky self-start min-w-96 top-8">
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

			<div class="space-y-1.5 w-full max-w-lg p-1 rounded-lg">
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

			<div class="flex items-center justify-center h-40 w-60">
				{#if hasIntersect && numPeoplePicked > 1}
					<div class="flex flex-col items-center justify-center gap-1.5 p-3 text-xs font-medium text-center border rounded-md bg-background/50 text-accent-foreground shadow-sm size-24">
						<Handshake class="size-6 text-primary " />
						Intersect
					</div>
				{:else}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<div class="inline-flex items-center gap-1 transition text-accent-foreground/50 hover:text-primary">
								<span class="text-base font-semibold tracking-wider tabular-nums">{intersectBreakers.length}&rarr;</span>
								<CircleCheckBig class="size-6" />
							</div>
						</HoverCard.Trigger>
						<HoverCard.Content class="w-80">
							<h3 class="mb-3 text-xl font-semibold tracking-tight">Intersect breakers</h3>
							{#each intersectBreakers as { avatar, firstName, lastName }}
								<div class="flex items-center gap-2">
									<Avatar.Root class="hidden size-8 sm:flex">
										<Avatar.Image src="/profile-pictures/{avatar}.jpg" alt="{firstName} {lastName}" />
										<Avatar.Fallback>{firstName?.charAt(0) ?? '-'}{lastName?.charAt(0) ?? '-'}</Avatar.Fallback>
									</Avatar.Root>
									<div class="grid gap-1">
										<p class="text-sm font-medium leading-none">{firstName} {lastName}</p>
									</div>
								</div>
							{/each}
						</HoverCard.Content>
					</HoverCard.Root>
				{/if}
			</div>
		</div>
	{/each}
{:else}
	<Card.Root class="w-full max-w-md m-auto text-center">
		<Card.Header class="py-10">
			<RouteOff class="mx-auto text-destructive size-16 " />
			<Card.Title class="text-2xl md:text-3xl">Nema više cile-mile</Card.Title>
			<Card.Description class="text-lg">Sve je finalizirano</Card.Description>
		</Card.Header>
		<Card.Footer class="flex flex-col items-center">
			<Button href="/gableci/vote">Idi na finalni izbor</Button>
			<Button variant="link" on:click={() => handleFinalize(true)} class="p-0 text-xs font-normal tracking-wide select-none opacity-5 hover:opacity-10 transiton">Otključaj</Button>
		</Card.Footer>
	</Card.Root>
{/if}

{#if !currentUserHasFinalized1 && displayedRestaurants.some((r) => r.statistics.hasIntersect)}
	<div transition:scale={{ start: 0.85 }} class="fixed z-20 w-80 right-10 bottom-10">
		<Card.Root class="shadow-lg">
			<Card.Header>
				<Card.Title class="inline-flex items-center gap-2">
					<PartyPopper class="stroke-[1.5] size-7" />
					Imamo interseeeeekt!
				</Card.Title>
				<Card.Description class="text-balance">Ako je to sve, finaliziraj pa možemo na <strong>finalno glasanje</strong>!</Card.Description>
			</Card.Header>
			<Card.Content>
				<Popover.Root>
					<Popover.Trigger><Button>Finaliziraj</Button></Popover.Trigger>
					<Popover.Content class="flex flex-col gap-2 shadow-2xl w-80">
						<span>There's no going back!<br />Valjda je to sve</span>
						<span class="mb-3 text-xs text-muted-foreground">Naknadno otključavanje: 5€ + PDV <span class="select-none opacity-15">(nije lol)</span></span>
						<Button on:click={() => handleFinalize()} variant="destructive" class="ml-auto">Ideme!</Button>
					</Popover.Content>
				</Popover.Root>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
