<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Home, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-svelte';

	import AppShell from '$lib/components/layout/AppShell.svelte';
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

		logger.error('App error page displayed', {
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

	const handleGoBack = () => {
		if (browser) {
			window.history.length > 1 ? window.history.back() : goto('/');
		}
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

<AppShell>
	<div class="flex h-full items-center justify-center p-4">
		<div class="w-full max-w-2xl">
			<div class="ui-card space-y-6 p-8">
				<div class="flex items-start gap-4">
					<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-rose-100">
						<AlertCircle class="h-8 w-8 text-rose-600" />
					</div>

					<div class="flex-1 space-y-2">
						<h1 class="text-2xl font-bold ui-text-primary">
							{getErrorMessage()}
						</h1>
						<p class="ui-text-muted">
							{getErrorDescription()}
						</p>
						{#if status}
							<div class="mt-3 inline-flex items-center gap-2 rounded-full border ui-border-subtle bg-[var(--ui-surface-subtle)] px-3 py-1.5 text-sm">
								<span class="ui-text-tertiary">{$t('errors.statusCode')}:</span>
								<span class="font-mono font-semibold ui-text-primary">{status}</span>
							</div>
						{/if}
					</div>
				</div>

				{#if browser && errorDetails}
					<div class="rounded-xl border ui-border-subtle bg-[var(--ui-surface-subtle)] p-4">
						<p class="mb-3 text-xs font-medium uppercase tracking-wide ui-text-muted">
							{$t('errors.details.title')}
						</p>
						<div class="space-y-2 text-sm">
							<div class="flex items-start gap-2">
								<span class="font-medium ui-text-secondary min-w-[100px]">{$t('errors.details.code')}:</span>
								<span class="font-mono ui-text-tertiary break-all">{errorDetails.code}</span>
							</div>
							<div class="flex items-start gap-2">
								<span class="font-medium ui-text-secondary min-w-[100px]">{$t('errors.details.message')}:</span>
								<span class="ui-text-tertiary break-all">{errorDetails.message}</span>
							</div>
							{#if errorId}
								<div class="flex items-start gap-2">
									<span class="font-medium ui-text-secondary min-w-[100px]">{$t('errors.details.id')}:</span>
									<span class="font-mono text-xs ui-text-muted break-all">{errorId}</span>
								</div>
							{/if}
							{#if $page.url.pathname}
								<div class="flex items-start gap-2">
									<span class="font-medium ui-text-secondary min-w-[100px]">{$t('errors.details.path')}:</span>
									<span class="font-mono text-xs ui-text-tertiary break-all">{$page.url.pathname}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<div class="flex flex-wrap gap-3 pt-2">
					<button class="ui-primary-button" onclick={handleGoHome}>
						<Home size={18} />
						<span>{$t('errors.actions.goHome')}</span>
					</button>
					<button class="ui-secondary-button" onclick={handleGoBack}>
						<ArrowLeft size={18} />
						<span>{$t('errors.actions.goBack')}</span>
					</button>
					<button class="ui-secondary-button" onclick={handleReload}>
						<RefreshCw size={18} />
						<span>{$t('errors.actions.reload')}</span>
					</button>
				</div>

				{#if browser && errorId}
					<p class="pt-4 text-center text-xs ui-text-subtle border-t ui-border-subtle">
						{$t('errors.help.text')}
						<span class="mt-2 block font-mono">{errorId}</span>
					</p>
				{/if}
			</div>
		</div>
	</div>
</AppShell>
