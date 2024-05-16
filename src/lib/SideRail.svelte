<script>
	// @ts-nocheck
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';

	import Tornado from 'lucide-svelte/icons/tornado';
	import Laugh from 'lucide-svelte/icons/laugh';
	import Settings from 'lucide-svelte/icons/settings';
	import Utensils from 'lucide-svelte/icons/utensils';
	import ListChecks from 'lucide-svelte/icons/list-checks';
	import Vote from 'lucide-svelte/icons/vote';
	import ChefHat from 'lucide-svelte/icons/chef-hat';
	import UserRound from 'lucide-svelte/icons/user-round';
	import LogOut from 'lucide-svelte/icons/log-out';
	import LogIn from 'lucide-svelte/icons/log-in';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

	import { page } from '$app/stores';

	let { logOut, isLoggedIn, userData } = $props();

	let currentRoute = $derived($page.url.pathname);
</script>

<aside class="fixed inset-y-0 left-0 z-10 flex-col hidden border-r w-14 bg-background sm:flex">
	<nav class="flex items-center justify-center h-16 px-2 border-b">
		<a href="/" class="flex items-center justify-center gap-2 text-lg font-semibold rounded-full bg-primary group size-9 shrink-0 text-primary-foreground md:size-8 md:text-base">
			<ChefHat class="transition-all size-5 group-hover:scale-110" />
			<span class="sr-only">Črepi letido</span>
		</a>
	</nav>
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		{#if isLoggedIn}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/gableci/pick"
						class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
						class:bg-accent={currentRoute === '/gableci/pick'}
						class:text-accent-foreground={currentRoute === '/gableci/pick'}
						use:builder.action
						{...builder}
					>
						<Utensils class="size-5" />
						<span class="sr-only">Meal selection</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Meal selection</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/gableci"
						class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
						class:bg-accent={currentRoute === '/gableci'}
						class:text-accent-foreground={currentRoute === '/gableci'}
						use:builder.action
						{...builder}
					>
						<ListChecks class="size-5" />
						<span class="sr-only">Restaurant selection</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Restaurant selection</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/gableci/vote"
						class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
						class:bg-accent={currentRoute === '/gableci/vote'}
						class:text-accent-foreground={currentRoute === '/gableci/vote'}
						use:builder.action
						{...builder}
					>
						<Vote class="size-5" />
						<span class="sr-only">Final vote</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Final vote</Tooltip.Content>
			</Tooltip.Root>
			<Separator />
		{/if}

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="/crep-storm"
					class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
					class:bg-accent={currentRoute === '/crep-storm'}
					class:text-accent-foreground={currentRoute === '/crep-storm'}
					use:builder.action
					{...builder}
				>
					<Tornado class="size-5" />
					<span class="sr-only">Črep-storm™</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Črep-storm™</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<a
					href="/joke-generator"
					class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
					class:bg-accent={currentRoute === '/joke-generator'}
					class:text-accent-foreground={currentRoute === '/joke-generator'}
					use:builder.action
					{...builder}
				>
					<Laugh class="size-5" />
					<span class="sr-only">Joke generator</span>
				</a>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Joke generator</Tooltip.Content>
		</Tooltip.Root>
	</nav>
	<nav class="flex flex-col items-center gap-4 px-2 mt-auto sm:py-5">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<div class="flex" use:builder.action {...builder}>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								class="flex items-center justify-center p-0 transition-colors bg-opacity-0 rounded-lg hover:bg-transparent size-9 text-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground md:size-8"
							>
								<Sun class="transition-all scale-100 rotate-0 size-5 dark:-rotate-90 dark:scale-0" />
								<Moon class="absolute transition-all scale-0 rotate-90 size-5 dark:rotate-0 dark:scale-100" />
								<span class="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56">
							<DropdownMenu.Label>Kak bu zgledalo?</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.RadioGroup value={$userPrefersMode}>
								<DropdownMenu.RadioItem on:click={() => setMode('light')} value="light">Svetle</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem on:click={() => setMode('dark')} value="dark">Tamne</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem on:click={() => setMode('system')} value="system">Kak sistem veli</DropdownMenu.RadioItem>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Luk i fil</Tooltip.Content>
		</Tooltip.Root>

		<Separator />

		{#if isLoggedIn}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/settings"
						class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8"
						class:bg-accent={currentRoute === '/settings'}
						class:text-accent-foreground={currentRoute === '/settings'}
						use:builder.action
						{...builder}
					>
						<Settings class="size-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<div class="flex" use:builder.action {...builder}>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button variant="outline" size="icon" class="overflow-hidden rounded-full size-9" builders={[builder]}>
									<Avatar.Root class="size-9">
										<Avatar.Image src="/profile-pictures/{userData?.avatar ?? 'fallback'}.jpg" alt="{userData?.firstName ?? ''} {userData?.lastName ?? ''}" />
										<Avatar.Fallback>{userData?.firstName?.charAt(0) ?? '-'}{userData?.lastName?.charAt(0) ?? '-'}</Avatar.Fallback>
									</Avatar.Root>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Label class="flex items-center gap-2">
									<UserRound class="size-5" />
									<div class="leading-none">
										<p>{userData?.firstName} {userData?.lastName}</p>
										<p class="text-sm font-normal text-muted-foreground">{userData?.email}</p>
									</div>
								</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item on:click={logOut}>
									<LogOut class="mr-2 size-5" />
									Logout
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">{userData?.firstName} {userData?.lastName}</Tooltip.Content>
			</Tooltip.Root>
		{:else}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a href="/auth" class="flex items-center justify-center transition-colors rounded-lg size-9 text-muted-foreground hover:text-foreground md:size-8" use:builder.action {...builder}>
						<LogIn class="size-5" />
						<span class="sr-only">Log in</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Log in</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</nav>
</aside>
