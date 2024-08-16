<script lang="ts">
	import type { SubmissionItemType } from '$lib/scheduler/db';
	import moment from 'moment';
	import ArrowUpRightFromSquare from './icons/arrow-up-right-from-square.svelte';
	import Ban from './icons/ban.svelte';
	import { createEventDispatcher } from 'svelte';
	import LoadingInner from './loading-inner.svelte';
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query';

	export let submission: SubmissionItemType;
	let loading = false;
	export let cancellable = true;

	const dispatch = createEventDispatcher();

	const queryClient = useQueryClient();
	const cancelMutation = useMutation(
		async () => {
			loading = true;
			const result = await fetch('/api/submission', {
				method: 'DELETE',
				body: JSON.stringify({ id: submission._id })
			});
			if (result) {
				dispatch('cancel', submission);
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

	const onClickCancel = () => {
		$cancelMutation.mutate();
	};
</script>

<div class="grid grid-cols-[1fr_auto]">
	<div
		class="p-4 flex flex-col gap-4"
		title={`Added: ${moment(submission.dueDatetime).format('dddd, hh:MM A DD/MM/YYYY')}`}
	>
		<a
			href={submission.url}
			target="_blank"
			class="font-bold flex gap-4 items-center w-fit text-xl"
		>
			{submission.title}
			<ArrowUpRightFromSquare class="h-6 fill-white" />
		</a>
		<span>
			Due: {moment(submission.dueDatetime).format('dddd, hh:mm A DD/MM/YYYY')}
		</span>
	</div>
	{#if cancellable}
		<div class="h-full flex items-center p-4">
			<button
				type="button"
				disabled={loading}
				class="btn-icon variant-filled-surface btn-icon-md relative"
				title="Cancel"
				on:click={onClickCancel}
			>
				{#if loading}
					<LoadingInner />
				{:else}
					<Ban class="fill-white h-6" />
				{/if}
			</button>
		</div>
	{/if}
</div>
