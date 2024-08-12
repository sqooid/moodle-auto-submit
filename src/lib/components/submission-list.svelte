<script lang="ts">
	import type { SubmissionItemType } from '$lib/scheduler/db';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import SubmissionItem from './submission-item.svelte';
	import { useQueryClient, useQuery } from '@sveltestack/svelte-query';

	const itemsQuery = useQuery<SubmissionItemType[]>('items', async () => {
		const result = await fetch('/api/submission');
		if (result.ok) {
			const items: SubmissionItemType[] = await result.json();
			return items.map((x) => {
				return {
					...x,
					addedDatetime: new Date(x.addedDatetime),
					dueDatetime: new Date(x.dueDatetime),
					doneDatetime: x.doneDatetime ? new Date(x.doneDatetime) : undefined
				};
			});
		} else {
			toastStore.trigger({
				message: 'Failed to update submissions',
				background: 'variant-filled-error'
			});
			return [];
		}
	});
	const dummy = {
		url: 'https://learning.monash.edu/mod/assign/view.php?id=608441',
		dueDatetime: new Date(1723773141),
		title: 'Lab 2 Submission',
		addedDatetime: new Date()
	};

	$: doneItems = $itemsQuery.data?.filter((x) => x.doneDatetime) ?? [];
	// let doneItems = [dummy, dummy];
	$: comingItems =
		$itemsQuery.data?.filter((x) => !x.doneDatetime && x.dueDatetime.valueOf() > Date.now()) ?? [];
	$: skippedItems =
		$itemsQuery.data?.filter((x) => !x.doneDatetime && x.dueDatetime.valueOf() < Date.now()) ?? [];

	const toastStore = getToastStore();
</script>

<div class="flex flex-col gap-4">
	<div class="card p-4 flex flex-col gap-4">
		<span class="text-xl font-bold">Scheduled Submissions</span>
		{#each comingItems as item, i}
			<SubmissionItem submission={item} />
			<hr class="last:invisible" />
		{:else}
			<span class="">None</span>
		{/each}
	</div>

	{#if skippedItems.length}
		<div class="card p-4 flex flex-col gap-4">
			<span class="text-xl font-bold">Skipped Submissions</span>
			{#each skippedItems as item, i}
				<SubmissionItem submission={item} />
				<hr class="last:invisible" />
			{:else}
				<span class="">None</span>
			{/each}
		</div>
	{/if}

	<div class="card p-4 flex flex-col gap-4">
		<span class="text-xl font-bold">Completed Submissions</span>
		{#each doneItems as item}
			<SubmissionItem submission={item} cancellable={false} />
			<hr class="last:invisible" />
		{:else}
			<span class="">None</span>
		{/each}
	</div>
</div>
