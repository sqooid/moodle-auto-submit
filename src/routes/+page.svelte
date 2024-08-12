<script lang="ts">
	import Info from '$lib/components/info.svelte';
	import SubmissionAdd from '$lib/components/submission-add.svelte';
	import SubmissionList from '$lib/components/submission-list.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col justify-center items-center w-full">
	<div class="flex flex-col gap-4 container">
		<div class="grid grid-cols-[auto_1fr] gap-4">
			<div>
				<Info tz={data.tz} email={data.email} />
			</div>
			<div>
				<SubmissionAdd />
			</div>
		</div>

		<div class="">
			<SubmissionList />
		</div>
	</div>
</div>
