<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import LoadingInner from './loading-inner.svelte';

	const dispatch = createEventDispatcher();
	const toastStore = getToastStore();

	let url = '';
	let loading = false;

	const onAdd = async () => {
		loading = true;
		const result = await fetch('/api/submission', {
			method: 'POST',
			body: JSON.stringify({ url })
		});
		if (result.ok) {
			toastStore.trigger({ message: 'Successfully scheduled submission' });
			dispatch('add');
		} else {
			const { message } = await result.json();
			toastStore.trigger({
				message: `Failed to add submission: ${message}`,
				background: 'variant-filled-error'
			});
		}
		loading = false;
	};
</script>

<div class="flex flex-col gap-4">
	<span class="font-bold text-xl">Schedule Submission</span>
	<label for="" class="label">
		<span>Assignment URL</span>
		<input type="url" class="input" id="" placeholder="https://..." bind:value={url} />
	</label>
	<button type="button" class="btn btn-md variant-filled-primary w-fit relative" on:click={onAdd}
		>Schedule
		{#if loading}
			<LoadingInner />
		{/if}
	</button>
</div>
