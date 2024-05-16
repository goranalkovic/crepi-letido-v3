// @ts-nocheck
import { getCurrentDate } from '$lib/current-date.js';

export const load = async ({ depends, locals: { supabase, user } }) => {
	const currentDate = getCurrentDate();

	const { data: customRestaurantData, error: err1 } = await supabase.from('custom-meal-data').select('id,created,meals,restaurant:restaurants(*)');
	const { data: restaurantData, error: err2 } = await supabase.from('meal-data').select('id,created,meals,restaurant:restaurants(*)').eq('valid', 'TRUE');
	const { data: userData, error: err3 } = await supabase.from('users').select().eq('email', user?.email).maybeSingle();

	const { data: existingData, error: err4 } = await supabase
		.from('meal-selections')
		.select('selected,final,user:users(*)')
		.gte('created', `${currentDate} 00:00:00`)
		.lte('created', `${currentDate} 23:59:59`);

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

	let chosenRestaurants = [];

	// const usersWithoutSelections = existingData.filter(({ selected }) => Object.keys(selected)?.length < 1);
	const usersWithSelections = existingData.filter(({ selected }) => Object.keys(selected)?.length > 0);

	existingData.forEach(({ selected, user }) => {
		Object.entries(selected).forEach(([slug, meals]) => {
			if (!chosenRestaurants.includes(slug)) {
				chosenRestaurants.push(slug);
			}

			meals.forEach(({ meal }) => {
				possibleSelections[slug][meal].selected.push(user);
			});
		});
	});

	const userStatisticsData = existingData
		.filter(({ selected }) => Object.keys(selected)?.length > 0)
		.map((i) => ({ mail: i.user.email, selections: i.selected }))
		.map((i) => {
			return {
				...i,
				numMealsOrdered: Object.entries(i.selections).reduce((prev, [k, v]) => ({
					...prev,
					[k]: v.length,
				}), {}),
			}
		})
		.map((i) => {
			return {
				...i,
				totalMealsOrdered: Object.values(i.numMealsOrdered).reduce((prev, curr) => prev + parseInt(curr), 0),
			}
		});

	let displayedRestaurants = [...restaurantData, ...customRestaurantData].filter(Boolean)
		.filter(({ restaurant: { slug } }) => chosenRestaurants.includes(slug))
		.map((i) => ({
			...i,
			statistics: {
				hasIntersect: userStatisticsData.every((userData) => Object.keys(userData.numMealsOrdered).includes(i.restaurant.slug)),
			}
		}))
		.filter((i) => i.statistics.hasIntersect)

		.toSorted((a, b) => {
			if (a.statistics.totalMealsOrdered === b.statistics.totalMealsOrdered) {
				return 0;
			}

			return b.statistics.totalMealsOrdered - a.statistics.totalMealsOrdered;
		})
		.toSorted((a, b) => {
			if (a.statistics.intersectBreakers?.length === b.statistics.intersectBreakers?.length) {
				return 0;
			}

			return b.statistics.intersectBreakers?.length - a.statistics.intersectBreakers?.length;
		})
		.toSorted((a, b) => {
			if (a.statistics.hasIntersect && b.statistics.hasIntersect) {
				return 0;
			}

			if (a.statistics.hasIntersect) {
				return -1;
			}

			return 1;
		});

	const finalize1DoneUsers = existingData.filter(({ final }) => final === true);

	const { data: currentUserHasFinalized1 } = await supabase
		.from('meal-selections')
		.select('final,finalVote')
		.eq('user', user?.email)
		.gte('created', `${currentDate} 00:00:00`)
		.lte('created', `${currentDate} 23:59:59`)
		.maybeSingle();

	const { data: allUserData } = await supabase.from('users').select();

	const { data: allThatFinalizedStep2 } = await supabase
		.from('meal-selections')
		.select()
		.not('finalVote', 'is', null)
		.gte('created', `${currentDate} 00:00:00`)
		.lte('created', `${currentDate} 23:59:59`);

	const sortedAllThatFinalizedStep2 = allThatFinalizedStep2.toSorted((a, b) => {
		if (a.user === user.email) {
			return 1;
		}

		return -1;
	}).map((item) => {
		const parsedFinalData = JSON.parse(item.finalVote);

		const moreData = [...restaurantData, ...customRestaurantData].filter(Boolean).reduce((prev, curr) => {
			if (curr.restaurant.slug === parsedFinalData.rest) {
				return {
					...prev,
					restaurant: curr.restaurant,
					meal: curr.meals[parsedFinalData.meal],
				};
			}

			return prev;
		}, {});

		return {
			user: allUserData.find(({ email }) => email === item.user),
			...moreData,
		};
	});

	return {
		restaurants: restaurantData ?? [],
		customRestaurants: customRestaurantData ?? [],
		userData,
		numUsers: existingData?.length,
		possibleSelections,
		chosenRestaurants,
		displayedRestaurants,
		numPeoplePicked: usersWithSelections?.length ?? 0,
		hasError: err1 || err2 || err3 || err4,
		finalize1DoneUsers,
		currentUserHasFinalized1: currentUserHasFinalized1?.final,
		currentUserHasFinalized2: currentUserHasFinalized1?.finalVote,
		allStep2Finalists: sortedAllThatFinalizedStep2,
	};
};