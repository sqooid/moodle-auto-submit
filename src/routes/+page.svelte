<script lang="ts">
	import Info from '$lib/components/info.svelte';
	import SubmissionAdd from '$lib/components/submission-add.svelte';
	import SubmissionList from '$lib/components/submission-list.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const onAddItem = async () => {
		const result = await fetch('/api/submission');
		if (result.ok) {
			data.items = await result.json();
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="grid grid-cols-[auto_1fr] gap-4">
		<div>
			<Info tz={data.tz} email={data.email} />
		</div>
		<div>
			<SubmissionAdd on:add={onAddItem} />
		</div>
	</div>

	<div class="">
		<SubmissionList items={data.items} />
	</div>
</div>
