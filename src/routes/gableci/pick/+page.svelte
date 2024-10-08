<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import Vegan from 'lucide-svelte/icons/vegan';
	import Phone from 'lucide-svelte/icons/phone';
	import Truck from 'lucide-svelte/icons/truck';
	import BookMarked from 'lucide-svelte/icons/book-marked';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import ShieldX from 'lucide-svelte/icons/shield-x';
	import RouteOff from 'lucide-svelte/icons/route-off';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Medal from 'lucide-svelte/icons/medal';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { debounce } from '$lib/debounce.js';
	import { getCurrentDate } from '$lib/current-date.js';
	import RestaurantCard from '$lib/RestaurantCard.svelte';

	import { scale } from 'svelte/transition';

	let { data } = $props();
	let { supabase, restaurants, customRestaurants, hasError, user, userSelections: rawUserSelections, currentUserHasFinalized1 } = $derived(data);

	const currentDate = getCurrentDate();

	let userSelections = $derived(rawUserSelections.selected);
	let customSelections = $state({});

	const updateData = async () => {
		if (!user?.email || !currentDate) {
			return;
		}

		const parsedSelctions = Object.entries($state.snapshot(userSelections)).reduce((prev, [key, vals]) => {
			const newVals = vals
				.filter(({ selected }) => selected)
				.map((v) => {
					delete v.selected;
					return v;
				});

			if (newVals.length < 1) {
				return prev;
			}

			return {
				...prev,
				[key]: newVals,
			};
		}, {});

		customSelections = $state.snapshot(userSelections);

		await supabase
			.from('meal-selections')
			.update({
				selected: parsedSelctions,
			})
			.eq('user', user.email)
			.gte('created', `${currentDate} 00:00:00`)
			.lte('created', `${currentDate} 23:59:59`);
	};

	const handleChange = debounce(updateData, 500);

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

		await invalidateAll();
	};

	$effect(() => {
		const restaurantDataChannel = supabase
			.channel('pickerRestaurantDataSub')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, async () => await invalidateAll())
			.subscribe();

		customSelections = userSelections;

		return () => {
			supabase.removeChannel(restaurantDataChannel);
		};
	});
</script>

<svelte:head>
	<title>Gablec picker | ČL</title>
</svelte:head>

{#if hasError}
	<Alert.Root>
		<Alert.Title>Nekaj se zblesiralo.</Alert.Title>
		<Alert.Description>Bude bolje zutra.</Alert.Description>
	</Alert.Root>
{/if}

{#if !currentUserHasFinalized1}
	{#if restaurants?.length < 1 && customRestaurants?.length < 1}
		<Card.Root class="w-full max-w-md m-auto text-center">
			<Card.Header class="py-10">
				<ShieldX class="mx-auto text-destructive size-16 " />
				<Card.Title class="text-2xl md:text-3xl">Nekaj gadno ne štima</Card.Title>
				<Card.Description class="text-lg">Nijenog restorana nema?!</Card.Description>
			</Card.Header>
		</Card.Root>
	{/if}

	{#if restaurants?.length > 0}
		<h2 class="pb-2 text-3xl font-semibold tracking-tight transition-colors border-b first:mt-0">Dnevni izbor</h2>
	{:else}
		<Card.Root class="w-full max-w-md m-auto text-center">
			<Card.Header class="py-10">
				<ShieldAlert class="mx-auto text-slate-400 size-16 dark:text-slate-600" />
				<Card.Title class="text-2xl md:text-3xl">Nekaj ne štima</Card.Title>
				<Card.Description class="text-base">Glavnih restorana nema. Možda je presušil source? Možda je crkel cron za update? Pitaj Goca.</Card.Description>
			</Card.Header>
		</Card.Root>
	{/if}

	{#each restaurants as { meals, restaurant, restaurant: { slug } } (restaurant.id)}
		<div class="flex gap-8 pb-4">
			<RestaurantCard {...restaurant} className="sticky self-start top-8" />

			<div class="space-y-0.5 w-full max-w-lg">
				{#each meals as { name, price, meta }, i (i)}
					<div class="flex items-center w-full p-3 space-x-3 transition duration-700 rounded-lg hover:bg-card">
						<Checkbox
							id="meal-{slug}-{i}"
							aria-labelledby="meal-{slug}-{i}-label"
							checked={userSelections?.[slug]?.[i]?.selected}
							onCheckedChange={(value) => {
								userSelections[slug][i].selected = value;

								handleChange();
							}}
						/>
						<Label
							id="meal-{slug}-{i}-label"
							for="meal-{slug}-{i}"
							class="space-y-1.5 w-full text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							<p>
								{name}
								{#if meta?.isVegetarian}
									<Vegan class="inline-block ml-1 size-4 text-lime-600 dark:text-lime-600" />
								{/if}
							</p>
							{#if price}
								<p class="text-muted-foreground">{price}</p>
							{/if}
						</Label>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if customRestaurants?.length > 0}
		<h2 class="pb-2 text-3xl font-semibold tracking-tight transition-colors border-b first:mt-0">Stalna postava</h2>
	{/if}

	{#each customRestaurants as { meals, restaurant, restaurant: { slug } } (restaurant.id)}
		<div class="flex gap-8 pb-4">
			<RestaurantCard {...restaurant} className="sticky self-start top-8" />

			<div class="space-y-0.5 w-full max-w-lg">
				{#each meals as { name, price, meta }, i (i)}
					<div class="flex items-center w-full p-3 space-x-3 transition duration-700 rounded-lg hover:bg-card">
						<Checkbox
							id="meal-{slug}-{i}"
							aria-labelledby="meal-{slug}-{i}-label"
							checked={userSelections?.[slug]?.[i]?.selected}
							onCheckedChange={(value) => {
								userSelections[slug][i].selected = value;

								handleChange();
							}}
						/>
						<Label
							id="meal-{slug}-{i}-label"
							for="meal-{slug}-{i}"
							class="space-y-1.5 w-full text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							<p>
								{name}
								{#if meta?.isVegetarian}
									<Vegan class="inline-block ml-1 size-4 text-lime-600 dark:text-lime-600" />
								{/if}
							</p>
							{#if price}
								<p class="text-muted-foreground">{price}</p>
							{/if}
						</Label>
					</div>
				{/each}
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

{#if Object.values(customSelections ?? {})
	.flat()
	.findIndex(({ selected }) => selected) > -1 && !currentUserHasFinalized1}
	<div transition:scale={{ start: 0.85 }} class="fixed z-20 w-80 right-10 bottom-10">
		<Card.Root class="shadow-lg">
			<Card.Header>
				<Card.Title class="inline-flex items-center gap-2">
					<Medal class="stroke-[1.5] size-7" />
					It's a start!
				</Card.Title>
				<Card.Description class="text-balance">Ako je to sve, možemo na <strong>overview</strong> da vidimo kak su drugi birali!</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href="/gableci">Aaaaajmo! <ArrowRight class="ml-2 size-5" /></Button>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
