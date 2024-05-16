// @ts-nocheck
import { getCurrentDate } from '$lib/current-date.js';

// @ts-nocheck
export const load = async ({ depends, locals: { supabase, user } }) => {
	const currentDate = getCurrentDate();

	const { data: customRestaurantData, error: err1 } = await supabase.from('custom-meal-data').select('id,created,meals,restaurant:restaurants(*)');
	const { data: restaurantData, error: err2 } = await supabase.from('meal-data').select('id,created,meals,restaurant:restaurants(*)').eq('valid', 'TRUE');
	const { data: userData, error: err3 } = await supabase.from('users').select().eq('email', user?.email).maybeSingle();

	let possibleSelections = [];

	possibleSelections = restaurantData.reduce((prev, { meals, restaurant: { slug } }) => {
		return {
			...prev,
			[slug]: [...Array(meals.length)].map((_, i) => ({ meal: i, selected: [] })),
		};
	}, {});

	possibleSelections = customRestaurantData.reduce(
		(prev, { meals, restaurant: { slug } }) => {
			return {
				...prev,
				[slug]: [...Array(meals.length)].map((_, i) => ({ meal: i, selected: [] })),
			};
		},
		{ ...possibleSelections }
	);

	const { data: existingUserData, error: err4 } = await supabase
		.from('meal-selections')
		.select('selected,final')
		.eq('user', user?.email)
		.gte('created', `${currentDate} 00:00:00`)
		.lte('created', `${currentDate} 23:59:59`)
		.maybeSingle();

	const existingSelections = existingUserData?.selected;

	let userSelections = existingUserData ?? {
		final: false,
		selected: {},
	};

	if (!existingUserData) {
		await supabase.from('meal-selections').insert({
			user: user?.email,
			final: false,
			selected: {},
		});
	} else {
	}

	userSelections.selected = [...restaurantData, ...customRestaurantData].filter(Boolean).reduce((prev, { meals, restaurant: { slug } }) => {
		return {
			...prev,
			[slug]: [...Array(meals.length)].map((_, i) => ({
				meal: i,
				selected: existingSelections ? existingSelections?.[slug]?.findIndex((item) => item?.meal === i) > -1 : false,
			})),
		};
	}, {});

	return {
		restaurants: restaurantData ?? [],
		customRestaurants: customRestaurantData ?? [],
		userData,
		possibleSelections,
		userSelections,
		hasError: err1 || err2 || err3 || err4,
	};
};