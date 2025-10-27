<script lang="ts">
	import { t } from '$lib/i18n';

	type LegendItem = { key: 'canopy' | 'moderate' | 'low' | 'alert'; color: string };
	type MetricKey = 'coverage' | 'vigor' | 'stress' | 'update';

	const legendBase: LegendItem[] = [
		{ key: 'canopy', color: '#111827' },
		{ key: 'moderate', color: '#475569' },
		{ key: 'low', color: '#d1d5db' },
		{ key: 'alert', color: '#f97316' }
	];

	const metricBase: Array<{ key: MetricKey; value: string }> = [
		{ key: 'coverage', value: '—' },
		{ key: 'vigor', value: '—' },
		{ key: 'stress', value: '0' },
		{ key: 'update', value: '—' }
	];

	$: legendItems = legendBase.map((item) => ({
		...item,
		label: $t(`parcelHealth.legend.${item.key}`)
	}));

	$: placeholderMetrics = metricBase.map((item) => ({
		key: item.key,
		value: item.value,
		label: $t(`parcelHealth.metrics.${item.key}.label`),
		caption: $t(`parcelHealth.metrics.${item.key}.caption`)
	}));
</script>

<svelte:head>
	<title>GAIA | {$t('parcelHealth.title')}</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<section class="ui-panel p-6">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<h1 class="text-3xl font-semibold ui-text-primary">{$t('parcelHealth.title')}</h1>
				<p class="mt-2 text-sm ui-text-subtle">{$t('parcelHealth.subtitle')}</p>
			</div>
			<span
				class="inline-flex items-center justify-center rounded-full border border-dashed ui-border-subtle px-4 py-1 text-xs font-semibold uppercase tracking-wide ui-text-muted"
			>
				{$t('parcelHealth.placeholderTag')}
			</span>
		</div>

		<div class="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
			<div
				class="relative overflow-hidden rounded-2xl border border-dashed ui-border-subtle bg-gradient-to-br from-slate-200 via-slate-100 to-white"
			>
				<div
					class="absolute inset-0 opacity-70"
					style="background-image: radial-gradient(circle at 25% 25%, rgba(15,23,42,0.2), transparent 55%), radial-gradient(circle at 75% 40%, rgba(15,23,42,0.16), transparent 60%);"
				></div>
				<div class="relative flex h-[420px] flex-col items-center justify-center gap-4 px-6 text-center">
					<span
						class="rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide ui-text-muted"
					>
						{$t('parcelHealth.mapPlaceholder.label')}
					</span>
					<p class="max-w-md text-sm ui-text-secondary">
						{$t('parcelHealth.mapPlaceholder.description')}
					</p>
					<div class="mt-6 grid w-full max-w-xl grid-cols-3 gap-2 text-left text-xs ui-text-subtle">
						{#each legendItems as layer}
							<div class="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2">
								<span class="h-2 w-2 rounded-full" style={`background:${layer.color}`}></span>
								<span class="truncate">{layer.label}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="ui-card p-5">
					<p class="text-sm font-semibold ui-text-secondary">{$t('parcelHealth.legend.title')}</p>
					<ul class="mt-4 space-y-3">
						{#each legendItems as item}
							<li class="flex items-center gap-3 text-sm ui-text-secondary">
								<span class="h-3 w-3 rounded-full" style={`background:${item.color}`}></span>
								<span>{item.label}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="ui-card p-5">
					<p class="text-sm font-semibold ui-text-secondary">{$t('parcelHealth.nextSteps.title')}</p>
					<p class="mt-2 text-sm ui-text-subtle">
						{$t('parcelHealth.nextSteps.description')}
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each placeholderMetrics as metric}
			<div class="ui-card p-5">
				<p class="text-xs font-medium uppercase tracking-wide ui-text-muted">{metric.label}</p>
				<p class="mt-3 text-2xl font-semibold ui-text-primary">{metric.value}</p>
				<p class="mt-1 text-sm ui-text-subtle">{metric.caption}</p>
			</div>
		{/each}
	</section>
</div>
