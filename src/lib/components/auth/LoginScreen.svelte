<script lang="ts">
	import { LogIn, AlertCircle } from 'lucide-svelte';

	import { signInWithGoogle, loading, error } from '$lib/stores/auth';
	import { t } from '$lib/i18n';

	let isSigningIn = false;

	const handleGoogleSignIn = async () => {
		isSigningIn = true;

		try {
			await signInWithGoogle();
		} catch (err) {
			console.error('Sign in failed:', err);
		} finally {
			isSigningIn = false;
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
				<img src="/icon-black.svg" alt="GAIA" class="h-12 w-12" />
			</div>
			<h2 class="ui-text-primary mb-2 text-3xl font-bold">
				{$t('common.welcome')}
			</h2>
			<p class="ui-text-tertiary">
				{$t('common.loginSubtitle')}
			</p>
		</div>

		<div class="ui-card rounded-xl p-8">
			<button
				type="button"
				on:click={handleGoogleSignIn}
				disabled={isSigningIn || $loading}
				class="ui-neutral-button"
			>
				<LogIn class="mr-2" size={18} />
				<span>
					{#if isSigningIn || $loading}
						{$t('common.signingIn')}
					{:else}
						{$t('common.signInWithGoogle')}
					{/if}
				</span>
			</button>

			{#if $error}
				<div class="ui-alert mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
					<AlertCircle size={16} />
					<span>{$error}</span>
				</div>
			{/if}
		</div>

		<p class="ui-text-subtle text-center text-sm">
			{$t('common.termsAcceptance')}
		</p>
		<p class="ui-text-subtle text-center text-xs">
			{$t('common.copyright')}
		</p>
	</div>
</div>
