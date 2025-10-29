<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Home, AlertCircle, RefreshCw } from 'lucide-svelte';

	import { t } from '$lib/i18n';
	import { logger } from '$lib/utils/logger';
	import { handleError, AppError } from '$lib/utils/error-handler';

	type ErrorParams = {
		status?: number;
		message?: string;
		error?: Error;
	};

	let { error, status }: ErrorParams = $props();

	let errorDetails = $state<AppError | null>(null);
	let errorId = $state<string>('');

	$effect(() => {
		if (!browser) return;

		errorDetails = handleError(error);
		errorId = `err-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

		logger.error('Error page displayed', {
			errorId,
			status,
			message: errorDetails?.message,
			code: errorDetails?.code,
			path: $page.url.pathname
		});
	});

	const getErrorMessage = (): string => {
		if (!errorDetails) return $t('errors.generic.title');

		const statusCode = status || errorDetails.statusCode || 500;

		if (statusCode === 404) {
			return $t('errors.notFound.title');
		}

		if (statusCode === 403 || statusCode === 401) {
			return $t('errors.forbidden.title');
		}

		if (statusCode >= 500) {
			return $t('errors.server.title');
		}

		return errorDetails.message || $t('errors.generic.title');
	};

	const getErrorDescription = (): string => {
		if (!errorDetails) return $t('errors.generic.description');

		const statusCode = status || errorDetails.statusCode || 500;

		if (statusCode === 404) {
			return $t('errors.notFound.description');
		}

		if (statusCode === 403 || statusCode === 401) {
			return $t('errors.forbidden.description');
		}

		if (statusCode >= 500) {
			return $t('errors.server.description');
		}

		return $t('errors.generic.description');
	};

	const handleGoHome = () => {
		goto('/');
	};

	const handleReload = () => {
		if (browser) {
			window.location.reload();
		}
	};
</script>

<svelte:head>
	<title>GAIA | {$t('errors.generic.title')}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[var(--ui-surface-muted)] p-4">
	<div class="w-full max-w-lg">
		<div class="ui-card space-y-6 p-8 text-center">
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
				<AlertCircle class="h-10 w-10 text-rose-600" />
			</div>

			<div class="space-y-2">
				<h1 class="text-3xl font-bold ui-text-primary">
					{getErrorMessage()}
				</h1>
				<p class="ui-text-muted">
					{getErrorDescription()}
				</p>
				{#if status}
					<div class="mt-4 inline-flex items-center gap-2 rounded-full border ui-border-subtle px-4 py-2 text-sm">
						<span class="ui-text-tertiary">{$t('errors.statusCode')}:</span>
						<span class="font-mono font-semibold ui-text-primary">{status}</span>
					</div>
				{/if}
			</div>

			{#if browser && errorDetails}
				<div class="rounded-xl border ui-border-subtle bg-[var(--ui-surface-subtle)] p-4 text-left">
					<p class="mb-2 text-xs font-medium uppercase tracking-wide ui-text-muted">
						{$t('errors.details.title')}
					</p>
					<div class="space-y-1 text-sm">
						<div>
							<span class="font-medium ui-text-secondary">{$t('errors.details.code')}:</span>
							<span class="font-mono ui-text-tertiary">{errorDetails.code}</span>
						</div>
						<div>
							<span class="font-medium ui-text-secondary">{$t('errors.details.message')}:</span>
							<span class="ui-text-tertiary">{errorDetails.message}</span>
						</div>
						{#if errorId}
							<div>
								<span class="font-medium ui-text-secondary">{$t('errors.details.id')}:</span>
								<span class="font-mono text-xs ui-text-muted">{errorId}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<button class="ui-primary-button" onclick={handleGoHome}>
					<Home size={18} />
					<span>{$t('errors.actions.goHome')}</span>
				</button>
				<button class="ui-secondary-button" onclick={handleReload}>
					<RefreshCw size={18} />
					<span>{$t('errors.actions.reload')}</span>
				</button>
			</div>
		</div>

		{#if browser}
			<p class="mt-4 text-center text-xs ui-text-subtle">
				{$t('errors.help.text')}
				{#if errorId}
					<span class="block mt-1 font-mono">{errorId}</span>
				{/if}
			</p>
		{/if}
	</div>
</div>

<style>
	:global(html) {
		overflow: hidden;
	}
</style>

