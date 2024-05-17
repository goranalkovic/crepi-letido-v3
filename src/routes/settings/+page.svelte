<script>
	// @ts-nocheck

	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Slider } from '$lib/components/ui/slider';

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
		{ value: 'ext1', label: 'Črep' },
		{ value: 'ext2', label: 'Šturm' },
		{ value: 'ext3', label: 'LED!!1!' },
		{ value: 'ext4', label: 'Kamp' },
		{ value: 'ext5', label: 'IksPe riba' },
		{ value: 'ext6', label: 'IksPe kvakva' },
		{ value: 'ext7', label: 'IksPe Hrca' },
		{ value: 'ext8', label: 'IksPe My10' },
		{ value: 'ext9', label: 'IksPe Jurica' },
		{ value: 'ext10', label: 'IksPe rafal' },
	];

	const themeNeutralOptions = [
		{ value: 'default', label: 'Tema nije kamen', twClass: 'bg-stone-500' },
		{ value: 'zinc', label: 'Zinkrono siva', twClass: 'bg-zinc-500' },
		{ value: 'slate', label: 'Malo plava, malo siva?', twClass: 'bg-slate-500' },
		{ value: 'gray', label: 'Jedna od nijansi', twClass: 'bg-gray-500' },
		{ value: 'neutral', label: 'Ler-siva', twClass: 'bg-neutral-500' },
	];

	const themeColorOptions = [
		{ value: 'magenta', label: 'Te-kom', twClass: 'bg-rose-500' },
		{ value: 'blue', label: 'Plava', twClass: 'bg-blue-500' },
		{ value: 'green', label: 'Zeljena', twClass: 'bg-green-500' },
		{ value: 'orange', label: 'Iskrasto narančasta', twClass: 'bg-orange-500' },
		{ value: 'red', label: 'SDP red', twClass: 'bg-red-500' },
		{ value: 'yellow', label: 'Žutislav', twClass: 'bg-yellow-500' },
		{ value: 'violet', label: 'Teta Violeta', twClass: 'bg-violet-500' },
	];

	let formData = $state({
		firstName: userData?.firstName,
		lastName: userData?.lastName,
		avatar: userData?.avatar,
		themeColor: userData?.options?.themeColor ?? 'default',
		themeMode: userData?.options?.themeMode ?? 'system',
		themeBorderRadius: userData?.options?.themeBorderRadius ?? '0.75',
	});
</script>

<svelte:head>
	<title>Settings | ČL</title>
</svelte:head>

<form method="POST" action="?/update" class="flex flex-col w-full max-w-screen-lg gap-4 lg:grid lg:grid-cols-2">
	<Card.Root class="w-full">
		<Card.Header class="border-b border-b-primary-accent">
			<Card.Title>Nekaj o tebi</Card.Title>
			<Card.Description>Nikaj preveč, samo osobni podaci</Card.Description>
		</Card.Header>
		<Card.Content class="p-6 space-y-6">
			<div class="gap-4 max-md:space-y-4 md:flex">
				<div class="space-y-1.5">
					<Label for="first-name">Ime</Label>
					<Input type="text" id="first-name" name="first-name" placeholder="Ime" class="w-full" bind:value={formData.firstName} />
					<!-- {#if !emailValid}
						<p transition:slide class="text-sm text-muted-foreground">E-mail is not valid!</p>
					{/if} -->
				</div>

				<div class="space-y-1.5">
					<Label for="last-name">Prezime</Label>
					<Input type="text" id="last-name" name="last-name" placeholder="Prezime" class="w-full" bind:value={formData.lastName} />
					<!-- {#if !emailValid}
						<p transition:slide class="text-sm text-muted-foreground">E-mail is not valid!</p>
					{/if} -->
				</div>
			</div>

			<div class="space-y-1.5">
				<Label>Oštar život imam ja?</Label>

				<div class="flex gap-6 py-2">
					<span class="inline-flex w-10 text-sm font-semibold select-none text-muted-foreground text-start">Da?</span>
					<Slider value={[parseFloat(formData?.themeBorderRadius)]} min={0} max={1} step={0.1} onValueChange={(v) => (formData.themeBorderRadius = parseInt(v * 100) / 100)} />
					<span class="inline-flex w-10 text-sm font-semibold select-none text-muted-foreground text-end">Ne?</span>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="border-b border-b-primary-accent">
			<Card.Title>Avatar</Card.Title>
			<Card.Description>Najbitniji dio, logično</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2 p-6">
			<Label>Ljudeki</Label>
			<div class="flex flex-wrap gap-2 mb-2">
				{#each avatarOptions.filter(({ value }) => !value.startsWith('ext')) as { label, value }}
					<Button class="justify-start h-12 px-2 w-36 wrap {formData?.avatar === value && 'border-2 border-primary'}" on:click={() => (formData.avatar = value)} variant="outline">
						<Avatar.Root class="mr-2 size-8">
							<Avatar.Image src="/profile-pictures/{value}.jpg" alt={label} />
							<Avatar.Fallback>{value}</Avatar.Fallback>
						</Avatar.Root>
						{label}
					</Button>
				{/each}
			</div>

			<Label>Nema čeg nema</Label>
			<div class="flex flex-wrap gap-1">
				{#each avatarOptions.filter(({ value }) => value.startsWith('ext')) as { label, value }}
					<Button class="justify-start h-12 px-2 w-36 {formData?.avatar === value && 'border-2 border-primary'}" on:click={() => (formData.avatar = value)} variant="outline">
						<Avatar.Root class="mr-2 size-8">
							<Avatar.Image src="/profile-pictures/{value}.jpg" alt={label} />
							<Avatar.Fallback>{value}</Avatar.Fallback>
						</Avatar.Root>
						{label}
					</Button>
				{/each}

				<Button class="justify-start h-12 px-2 w-36 {!formData?.avatar && 'border-2 border-primary'}" on:click={() => (formData.avatar = null)} variant="outline">
					<div class="flex items-center justify-center mr-2 rounded-full size-8 bg-slate-600 text-slate-300">
						{formData?.firstName?.charAt(0) ?? ''}{formData?.lastName?.charAt(0) ?? ''}
					</div>
					I'm boring
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="border-b border-b-primary-accent">
			<Card.Title>Tema sučelja</Card.Title>
			<Card.Description>Ima struje/nema struje?</Card.Description>
		</Card.Header>
		<Card.Content class="p-6 space-y-4">
			<div class="space-y-1.5">
				<Button class=" h-16 w-full justify-start {formData.themeMode === 'system' && 'border-2 border-primary'}" variant="outline" on:click={() => (formData.themeMode = 'system')}>
					<SunMoon class="mr-2 opacity-75 size-8" />
					Kak šef odluči, tak bu (system)
				</Button>
				<Button class=" h-16 w-full justify-start {formData.themeMode === 'light' && 'border-2 border-primary'}" variant="outline" on:click={() => (formData.themeMode = 'light')}>
					<Sun class="mr-2 opacity-75 size-8" />
					Vužgaj nek se troši
				</Button>
				<Button class=" h-16 w-full justify-start {formData.themeMode === 'dark' && 'border-2 border-primary'}" variant="outline" on:click={() => (formData.themeMode = 'dark')}>
					<Moon class="mr-2 opacity-75 size-8" />
					Vampir mode
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="border-b border-b-primary-accent">
			<Card.Title>Boja sučelja</Card.Title>
			<Card.Description>Not sponsored by Jupol</Card.Description>
		</Card.Header>
		<Card.Content class="p-6 space-y-4">
			<div class="space-y-1.5">
				<Label>Život ti je siv?</Label>
				<div class="flex flex-wrap w-full gap-1 pb-3">
					{#each themeNeutralOptions as { label, value, twClass }}
						<Button class={formData.themeColor === value && 'border-2 border-primary'} variant="outline" on:click={() => (formData.themeColor = value)} size="sm">
							<div class="mr-2 rounded-full size-5 {twClass}"></div>
							{label}
						</Button>
					{/each}
				</div>

				<Label>... ili ipak nije?</Label>
				<div class="flex flex-wrap w-full gap-1">
					{#each themeColorOptions as { label, value, twClass }}
						<Button class={formData.themeColor === value && 'border-2 border-primary'} variant="outline" on:click={() => (formData.themeColor = value)} size="sm">
							<div class="mr-2 rounded-full size-5 {twClass}"></div>
							{label}
						</Button>
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<input type="hidden" name="theme-mode" value={formData?.themeMode} />
	<input type="hidden" name="theme-border-radius" value={formData?.themeBorderRadius} />
	<input type="hidden" name="theme-color" value={formData?.themeColor} />
	<input type="hidden" name="avatar" value={formData?.avatar} />

	<div class="justify-self-center md:col-span-2">
		<Button size="lg" type="submit" disabled={!formValid}>Spremi</Button>
	</div>
</form>
