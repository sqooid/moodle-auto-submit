<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import LoadingInner from './loading-inner.svelte';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';

	const toastStore = getToastStore();

	let url = '';
	let loading = false;

	const queryClient = useQueryClient();
	const addMutation = useMutation(
		async () => {
			loading = true;
			const result = await fetch('/api/submission', {
				method: 'POST',
				body: JSON.stringify({ url })
			});
			if (result.ok) {
				toastStore.trigger({ message: 'Successfully scheduled submission' });
			} else {
				const { message } = await result.json();
				toastStore.trigger({
					message: `Failed to add submission: ${message}`,
					background: 'variant-filled-error'
				});
			}
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('items');
			},
			onSettled: () => {
				loading = false;
			}
		}
	);
</script>

<div class="flex flex-col gap-4">
	<span class="font-bold text-xl">Schedule Submission</span>
	<label for="" class="label">
		<span>Assignment URL</span>
		<input type="url" class="input" id="" placeholder="https://..." bind:value={url} />
	</label>
	<button
		type="button"
		disabled={loading}
		class="btn btn-md variant-filled-primary w-fit relative"
		on:click={() => $addMutation.mutate()}
		>Schedule
		{#if loading}
			<LoadingInner />
		{/if}
	</button>
</div>
