<script>
// @ts-nocheck
	import '../app.css';

	import { goto, invalidate, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import PageTitle from '$lib/PageTitle.svelte';
	import SideRail from '$lib/SideRail.svelte';
	import { setUpColorMode } from '$lib/dark-mode-listener';

	let { data, children } = $props();
	let { session, supabase, userData } = $derived(data);

	let currentRoute = $derived($page.url.pathname);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect.pre(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				let timeout;

				if (currentRoute === '/check-email') {
					timeout = 3000;
				}

				const pageStatus = parseInt($page.status ?? '200');

				if (pageStatus >= 200 && pageStatus < 300) {
					setTimeout(() => {
						goto('/', { invalidateAll: true });
					}, timeout);
				}
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const logOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
			return;
		}
	};

	$effect.pre(() => {
		const removeListener = setUpColorMode();

		return () => {
			if (typeof removeListener === 'function') {
				removeListener();
			}
		};
	});
</script>

<div class="flex flex-col w-full min-h-screen transition-colors bg-secondary dark:bg-primary/[0.025]">
	<SideRail {logOut} isLoggedIn={session !== null} {userData} />

	<PageTitle />

	<main class="flex flex-col flex-1 gap-4 p-4 sm:p-6 md:gap-8 sm:ml-14">
		{@render children()}
	</main>
</div>
