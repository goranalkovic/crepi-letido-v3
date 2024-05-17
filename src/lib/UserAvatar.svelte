<script>
	// @ts-nocheck
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';

	let { firstName, lastName, avatar, noTooltip = false } = $props();
</script>

{#snippet avatarDisplay()}
	<Avatar.Root class="border-2 size-9 border-secondary dark:border-background bg-background">
		<Avatar.Image src="/profile-pictures/{avatar}.jpg" alt="{firstName ?? ''} {lastName ?? ''}" />
		<Avatar.Fallback>{firstName?.charAt(0) ?? '-'}{lastName?.charAt(0) ?? '-'}</Avatar.Fallback>
	</Avatar.Root>
{/snippet}

{#if noTooltip}
	{@render avatarDisplay()}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{@render avatarDisplay()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{firstName}
			{lastName}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
