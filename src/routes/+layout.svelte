<script lang="ts">
	import '../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toast />
<AppBar><h1 class="text-3xl font-extrabold">Moodle Automatic Submitter</h1></AppBar>
<div class="p-4">
	<slot />
</div>
