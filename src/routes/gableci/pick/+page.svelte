<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import Vegan from 'lucide-svelte/icons/vegan';
	import Phone from 'lucide-svelte/icons/phone';
	import Truck from 'lucide-svelte/icons/truck';
	import BookMarked from 'lucide-svelte/icons/book-marked';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import ShieldX from 'lucide-svelte/icons/shield-x';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { debounce } from '$lib/debounce.js';
	import { getCurrentDate } from '$lib/current-date.js';

	let { data } = $props();
	let { supabase, restaurants, customRestaurants, hasError, user, userSelections: rawUserSelections } = $derived(data);

	const currentDate = getCurrentDate();

	let userSelections = $derived(rawUserSelections.selected);

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

	$effect(() => {
		const restaurantDataChannel = supabase
			.channel('pickerRestaurantDataSub')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, async () => await invalidateAll())
			.subscribe();

		return () => {
			supabase.removeChannel(restaurantDataChannel);
		};
	});
</script>

{#if hasError}
	<Alert.Root>
		<Alert.Title>Nekaj se zblesiralo.</Alert.Title>
		<Alert.Description>Bude bolje zutra.</Alert.Description>
	</Alert.Root>
{/if}

{#snippet gablecDisplay({ meals, restaurant: { name, phone, slug, url, delivery, urlType } })}
	<div class="flex gap-8 pb-4">
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
					<Label id="meal-{slug}-{i}-label" for="meal-{slug}-{i}" class="space-y-1.5 w-full text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
{/snippet}

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

{#each restaurants as restaurant (restaurant.id)}
	{@render gablecDisplay(restaurant)}
{/each}

{#if customRestaurants?.length > 0}
	<h2 class="pb-2 text-3xl font-semibold tracking-tight transition-colors border-b first:mt-0">Stalna postava</h2>
{/if}

{#each customRestaurants as restaurant (restaurant.id)}
	{@render gablecDisplay(restaurant)}
{/each}
