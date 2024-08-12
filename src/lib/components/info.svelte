<script lang="ts">
	import { getToastStore, ProgressRadial, Toast } from '@skeletonlabs/skeleton';
	import InfoItem from './info-item.svelte';
	import LoadingInner from './loading-inner.svelte';

	export let tz: string;
	export let email: string;

	const toastStore = getToastStore();
	let loadingTest = false;

	const onClickTest = async () => {
		loadingTest = true;
		const result = await fetch('/api/status');
		if (result.ok) {
			toastStore.trigger({ message: 'Login successful' });
		} else {
			toastStore.trigger({
				message: 'Login failed. Check server configuration',
				background: 'variant-filled-error'
			});
		}
		loadingTest = false;
	};
</script>

<div class="flex flex-col p-4 card w-fit">
	<span class="font-bold">Server Information</span>
	<hr class="my-2" />
	<InfoItem name="Timezone" value={tz} />
	<InfoItem name="Email" value={email} />
	<hr class="my-2" />
	<button
		type="button"
		class="btn variant-filled relative"
		disabled={loadingTest}
		on:click={onClickTest}
		>Test Moodle Connection
		{#if loadingTest}
			<LoadingInner />
		{/if}
	</button>
</div>
