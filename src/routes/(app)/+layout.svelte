<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { loading, user } from '$lib/stores/auth';

	onMount(() => {
		if (!browser) return;

		const unsubscribe = user.subscribe(($user) => {
			if (!$user && !get(loading)) {
				goto('/login');
			}
		});

		return () => unsubscribe();
	});
</script>

<AppShell>
	<svelte:fragment slot="fallback">
		<div class="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
			<div class="text-center">
				<div class="ui-loading-spinner mx-auto mb-4"></div>
				<p class="ui-text-tertiary text-sm">Redirecting...</p>
			</div>
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
