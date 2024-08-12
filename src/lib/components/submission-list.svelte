<script lang="ts">
	import type { SubmissionItemType } from '$lib/scheduler/db';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import SubmissionItem from './submission-item.svelte';

	export let items: SubmissionItemType[] = [];
	$: doneItems = items.filter((x) => x.dueDatetime.valueOf() < Date.now());
	$: comingItems = items.filter((x) => x.dueDatetime.valueOf() > Date.now());

	const toastStore = getToastStore();

	const onCancel = async (e: CustomEvent<SubmissionItemType>, i: number) => {
		const result = await fetch('/api/submission');
		if (result.ok) {
			items = await result.json();
		} else {
			toastStore.trigger({
				message: 'Failed to update submissions',
				background: 'variant-filled-error'
			});
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="card p-4 flex flex-col gap-4">
		<span class="text-xl font-bold">Scheduled Submissions</span>
		{#each doneItems as item, i}
			<SubmissionItem submission={item} on:cancel={(x) => onCancel(x, i)} />
		{:else}
			<span class="">None</span>
		{/each}
	</div>

	<div class="card p-4 flex flex-col gap-4">
		<span class="text-xl font-bold">Completed Submissions</span>
		{#each comingItems as item}
			<SubmissionItem submission={item} cancellable={false} />
		{:else}
			<span class="">None</span>
		{/each}
	</div>
</div>
