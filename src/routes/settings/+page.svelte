<script>
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import SunMoon from 'lucide-svelte/icons/sun-moon';

	let { data } = $props();
	let { userData } = $state(data);

	let formValid = $state(true);

	const avatarOptions = [
		{ value: 'aco', label: 'Aco Braco' },
		{ value: 'ceh', label: 'Čeh' },
		{ value: 'goc', label: 'Goc' },
		{ value: 'hrvoic', label: 'Hrvoić' },
		{ value: 'jurica', label: 'Jurica' },
		{ value: 'jurica2', label: 'Jurica (2)' },
		{ value: 'kanc', label: 'KancIvan' },
		{ value: 'my10', label: 'Majcen' },
		{ value: 'petarjadek', label: 'Petar' },
		{ value: 'tamara', label: 'Tamara' },
		{ value: 'ext1', label: 'Gost 1' },
		{ value: 'ext2', label: 'Gost 2' },
		{ value: 'ext3', label: 'Gost 3' },
		{ value: 'ext4', label: 'Gost 4' },
		{ value: 'ext5', label: 'Gost 5' },
		{ value: 'ext6', label: 'Gost 6' },
		{ value: 'ext7', label: 'Gost 7' },
		{ value: 'ext8', label: 'Gost 8' },
		{ value: 'ext9', label: 'Gost 9' },
		{ value: 'ext10', label: 'Gost 10' },
	];

	const themeColorOptions = [
		{ value: 'default', label: 'Kak je inače', twClass: 'bg-zinc-500' },
		{ value: 'blue', label: 'Plava', twClass: 'bg-blue-500' },
		{ value: 'green', label: 'Zeljena', twClass: 'bg-green-500' },
		{ value: 'orange', label: 'Žutislav', twClass: 'bg-orange-500' },
		{ value: 'magenta', label: 'Te-kom', twClass: 'bg-rose-500' },
	];

	let formData = $state({
		firstName: userData?.firstName,
		lastName: userData?.lastName,
		avatar: userData?.avatar,
		themeColor: userData?.options?.themeColor ?? 'default',
		themeMode: userData?.options?.themeMode ?? 'system',
	});
</script>

<svelte:head>
   <title>Settings | ČL</title>
</svelte:head>

<form method="POST" action="?/update" class="flex flex-col items-end w-full max-w-md gap-4">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Nekaj o tebi</Card.Title>
			<Card.Description>Nikaj preveč, samo osobni podaci</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-1.5">
				<Label for="first-name">Ime</Label>
				<Input type="text" id="first-name" name="first-name" placeholder="Ime" class="w-full" bind:value={formData.firstName} />
				<!-- {#if !emailValid}
					<p transition:slide class="text-sm text-muted-foreground">E-mail is not valid!</p>
				{/if} -->
			</div>

			<div class="space-y-1.5">
				<Label for="last-name">Ime</Label>
				<Input type="text" id="last-name" name="last-name" placeholder="Prezime" class="w-full" bind:value={formData.lastName} />
				<!-- {#if !emailValid}
					<p transition:slide class="text-sm text-muted-foreground">E-mail is not valid!</p>
				{/if} -->
			</div>

			<div class="space-y-1.5">
				<Label>Avatar</Label>
				<br />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button class="p-0 size-16" variant="outline" builders={[builder]}>
							{#if formData?.avatar && !formData?.avatar?.startsWith('ext-')}
								<Avatar.Root class="size-10">
									<Avatar.Image src="/profile-pictures/{formData?.avatar}.jpg" alt={userData?.email} />
									<Avatar.Fallback>{formData?.avatar}</Avatar.Fallback>
								</Avatar.Root>
							{:else}
								<div class="flex items-center justify-center text-lg rounded-full size-10 bg-slate-600 text-slate-300">
									{formData?.firstName?.charAt(0) ?? ''}{formData?.lastName?.charAt(0) ?? ''}
								</div>
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>Avatar</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup bind:value={formData.avatar}>
							<DropdownMenu.RadioItem value="">
								<div class="flex items-center justify-center mr-2 rounded-full size-8 bg-slate-600 text-slate-300">
									{formData?.firstName?.charAt(0) ?? ''}{formData?.lastName?.charAt(0) ?? ''}
								</div>
								Inicijali (nič)
							</DropdownMenu.RadioItem>
							<DropdownMenu.Separator />
							{#each avatarOptions.filter(({ value }) => !value.startsWith('ext')) as { label, value }}
								<DropdownMenu.RadioItem {value}>
									<Avatar.Root class="mr-2 size-8">
										<Avatar.Image src="/profile-pictures/{value}.jpg" alt={label} />
										<Avatar.Fallback>{value}</Avatar.Fallback>
									</Avatar.Root>
									{label}
								</DropdownMenu.RadioItem>
							{/each}
							<DropdownMenu.Separator />
							{#each avatarOptions.filter(({ value }) => value.startsWith('ext')) as { label, value }}
								<DropdownMenu.RadioItem {value}>
									<Avatar.Root class="mr-2 size-8">
										<Avatar.Image src="/profile-pictures/{value}.jpg" alt={label} />
										<Avatar.Fallback>{value}</Avatar.Fallback>
									</Avatar.Root>
									{label}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<!-- {#if !emailValid}
					<p transition:slide class="text-sm text-muted-foreground">E-mail is not valid!</p>
				{/if} -->

				<input type="hidden" name="avatar" value={formData?.avatar} />
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Sučelje</Card.Title>
			<Card.Description>Zasad samo farbanje i tak to</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-1.5">
				<Label>Sunce, mesec i tak (svjetlina sučelja)</Label>
				<br />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button class="justify-start w-full h-16 py-0" variant="outline" builders={[builder]}>
							{#if formData?.themeMode === 'light'}
								<Sun class="mr-2 opacity-75 size-8" />
								Vužgaj nek se troši
							{:else if formData?.themeMode === 'dark'}
								<Moon class="mr-2 opacity-75 size-8" />
								Vampir mode
							{:else}
								<SunMoon class="mr-2 opacity-75 size-8" />
								Kak šef odluči, tak bu (system)
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>Kak pa da svetli?</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup bind:value={formData.themeMode}>
							<DropdownMenu.RadioItem value="system">Kak šef hoće (system)</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="light">Vužgaj svetlo navek (light)</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="dark">Vampir sam (dark)</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<input type="hidden" name="theme-mode" value={formData?.themeMode} />
			</div>

			<div class="space-y-1.5">
				<Label>Tema sučelja</Label>
				<br />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button class="justify-start w-full h-16 py-0" variant="outline" builders={[builder]}>
							<div class="rounded-full mr-3 size-8 {themeColorOptions.find(({ value }) => value === formData.themeColor)?.twClass}"></div>
							{themeColorOptions.find(({ value }) => value === formData.themeColor)?.label}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>Slika profila</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup bind:value={formData.themeColor}>
							{#each themeColorOptions as { label, value, twClass }}
								<DropdownMenu.RadioItem {value}>
									<div class="mr-2 rounded-full size-8 {twClass}"></div>
									{label}
								</DropdownMenu.RadioItem>

								{#if value === 'default'}
									<DropdownMenu.Separator />
								{/if}
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<input type="hidden" name="theme-color" value={formData?.themeColor} />
			</div>
		</Card.Content>
	</Card.Root>

	<Button type="submit" disabled={!formValid}>Spremi</Button>
</form>
