<script>
// @ts-nocheck

	import '../app.css';

	// import { ModeWatcher } from "mode-watcher";

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import PageTitle from '$lib/PageTitle.svelte';
	import SideRail from '$lib/SideRail.svelte';

	let { data, children } = $props();
	let { session, supabase, userData } = $derived(data);

	let currentRoute = $derived($page.url.pathname);

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

				setTimeout(() => {
					goto('/', { invalidateAll: true });
				}, timeout);
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
		const themeColor = userData?.options?.themeColor ?? 'default';
		const themeMode = userData?.options?.themeMode ?? 'system';

		if (themeColor === 'default') {
			document.documentElement.removeAttribute('cl-theme');
		} else {
			document.documentElement.setAttribute('cl-theme', themeColor);
		}

		if (themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<div class="flex flex-col w-full min-h-screen transition-colors bg-secondary dark:bg-primary/[0.025]">
	<SideRail {logOut} isLoggedIn={session !== null} {userData} />

	<PageTitle />

	<main class="flex flex-col flex-1 gap-4 p-4 sm:p-6 md:gap-8 sm:ml-14">
		{@render children()}
	</main>
</div>

<!-- <ModeWatcher /> -->