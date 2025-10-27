<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	import LoginScreen from '$lib/components/auth/LoginScreen.svelte';
	import { loading, user } from '$lib/stores/auth';
	import { t } from '$lib/i18n';

	onMount(() => {
		if (!browser) return;

		if (get(user)) {
			goto('/');
			return;
		}

		const unsubscribe = user.subscribe(($user) => {
			if ($user) {
				goto('/');
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<title>GAIA | {$t('common.signInWithGoogle')}</title>
</svelte:head>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
		<div class="text-center">
			<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900"></div>
			<p class="ui-text-tertiary">{$t('common.loading')}</p>
		</div>
	</div>
{:else if $user}
	<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
		<p class="ui-text-tertiary text-sm">{$t('common.loading')}</p>
	</div>
{:else}
	<LoginScreen />
{/if}
