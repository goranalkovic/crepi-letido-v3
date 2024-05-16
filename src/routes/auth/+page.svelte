<script>
	// @ts-nocheck
	import { slide } from 'svelte/transition';

	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	let emailValue = $state('');

	const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	let emailValid = $derived(emailRegExp.test(emailValue));
</script>

<div class="flex flex-col items-center justify-center w-screen h-screen gap-2">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Želiš gablec?</Card.Title>
			<Card.Description>Bez logina dalje ne bu išlo.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" action="?/login" class="flex flex-col items-end gap-4">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input type="email" id="email" name="email" placeholder="crep.crepanovic@letido.mdj" bind:value={emailValue} />
				</div>

				<div class="flex items-center w-full gap-4">
					{#if !emailValid && emailValue?.length > 5}
						<p transition:slide class="text-sm text-destructive">E-mail is not valid!</p>
					{/if}

					<Button class="ml-auto" type="submit" disabled={!emailValid}>Ideme!</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
