<script>
	// @ts-nocheck
	import Vegan from 'lucide-svelte/icons/vegan';
	import CloudRainWind from 'lucide-svelte/icons/cloud-rain-wind';
	import Sticker from 'lucide-svelte/icons/sticker';
	import Hourglass from 'lucide-svelte/icons/hourglass';
	import Atom from 'lucide-svelte/icons/atom';
	import TicketCheck from 'lucide-svelte/icons/ticket-check';

	import { getCurrentDate } from '$lib/current-date.js';

	import { invalidateAll } from '$app/navigation';
	import { slide, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Popover from '$lib/components/ui/popover';
	import RestaurantCard from '$lib/RestaurantCard.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';

	let { data } = $props();
	let { supabase, possibleSelections, hasError, displayedRestaurants, numPeoplePicked, user, allStep2Finalists, finalize1DoneUsers, currentUserHasFinalized1, currentUserHasFinalized2, numUsers } =
		$derived(data);

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

	let selectedFinalMeal = $state();

	const handleFinalize2 = async (revert = false) => {
		const currentDate = getCurrentDate();

		await supabase
			.from('meal-selections')
			.update({
				finalVote: revert ? null : selectedFinalMeal,
			})
			.eq('user', user.email)
			.gte('created', `${currentDate} 00:00:00`)
			.lte('created', `${currentDate} 23:59:59`);

		await invalidateAll();
	};

	$effect(() => {
		invalidateAll();
	});
</script>

<svelte:head>
	<title>Final voting | ČL</title>
</svelte:head>

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
{:else if finalize1DoneUsers?.length < numUsers}
	<Card.Root class="w-full max-w-md m-auto text-center">
		<Card.Header class="py-10">
			<Hourglass class="mx-auto text-accent-foreground size-16 " />
			<Card.Title class="text-2xl md:text-3xl">Strpljenje, molim</Card.Title>
			<Card.Description class="text-lg">Još nisu svi finalizirali</Card.Description>
		</Card.Header>
	</Card.Root>
{:else if !currentUserHasFinalized2}
	{#each displayedRestaurants as { id, meals, restaurant, restaurant: { slug } } (id)}
		<div class="flex gap-8 pb-8 border-b last:border-b-0" transition:scale={{ start: 0.95 }} animate:flip={{ duration: 500 }}>
			<RestaurantCard {...restaurant} className="sticky self-start top-8" />

			<div class="space-y-1.5 w-full max-w-lg p-1 rounded-lg">
				{#each meals as { name, price, meta }, i (i)}
					{#if possibleSelections[slug][i].selected?.findIndex(({ email }) => email === user?.email) > -1}
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

							<Button
								variant={selectedFinalMeal?.rest === slug && selectedFinalMeal?.meal === i ? 'default' : 'outline'}
								on:click={() => {
									selectedFinalMeal = {
										rest: slug,
										meal: i,
									};
								}}
							>
								Odaberi restoran i jelo
							</Button>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
{:else}
	<Card.Root class="w-full max-w-md mx-auto my-10 text-center">
		<Card.Header class="py-10">
			<TicketCheck class="mx-auto text-accent-foreground size-16 " />
			<Card.Title class="text-2xl md:text-3xl">To je to!</Card.Title>
			<Card.Description class="text-lg">Ispod se budu pojavili glasovi drugih ljudi</Card.Description>
		</Card.Header>
	</Card.Root>

	<div class="grid w-full max-w-screen-lg grid-cols-3 mx-auto text-lg font-bold">
		<p>Korisnik</p>
		<p>Restoran</p>
		<p>Jelo</p>
	</div>
	{#each allStep2Finalists as { user, user: { firstName, lastName, avatar }, restaurant: { name, slug }, meal }}
		<div class="grid w-full max-w-screen-lg grid-cols-3 mx-auto">
			<div class="flex items-center gap-2">
				<UserAvatar {...user} noTooltip />
				<p class="text-sm font-medium leading-none">{firstName} {lastName}</p>
			</div>

			<div class="flex items-center gap-2">
				<img class="size-6" src="/restaurant-icons/{slug}.png" alt={name} />
				{name}
			</div>
			<div class="space-y-1.5 w-full text-sm font-medium leading-none mx-w-lg">
				<p>
					{meal.name}
				</p>
				{#if meal.price}
					<p class="text-muted-foreground">{meal.price}</p>
				{/if}
			</div>
		</div>
	{/each}

	<Button variant="link" on:click={() => handleFinalize2(true)} class="p-0 text-xs font-normal tracking-wide select-none opacity-5 hover:opacity-10 transiton">Otključaj</Button>
{/if}

{#if !currentUserHasFinalized2 && selectedFinalMeal}
	<div transition:scale={{ start: 0.85 }} class="fixed z-20 w-80 right-10 bottom-10">
		<Card.Root class="shadow-lg">
			<Card.Header>
				<Card.Title class="inline-flex items-center gap-2">
					<Atom class="stroke-[1.5] size-7" />
					Nisam Tarik, ali...
				</Card.Title>
				<Card.Description class="text-balance">
					Je li ovo tvoj konačni odgovor?
					<br />
					<br />
					Ako je, <strong>finaliziraj</strong> i onda čekaš!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Popover.Root>
					<Popover.Trigger><Button>Finaliziraj</Button></Popover.Trigger>
					<Popover.Content class="flex flex-col gap-2 shadow-2xl w-80">
						<span>There's no going back!<br />Valjda je to sve</span>
						<span class="mb-3 text-xs text-muted-foreground">Naknadno otključavanje: 5€ + PDV <span class="select-none opacity-15">(nije lol)</span></span>
						<Button on:click={() => handleFinalize2()} variant="destructive" class="ml-auto">Ideme!</Button>
					</Popover.Content>
				</Popover.Root>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
