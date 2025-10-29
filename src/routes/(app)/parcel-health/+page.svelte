<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map as LeafletMap } from 'leaflet';
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { t } from '$lib/i18n';
	import { logger } from '$lib/utils/logger';
	import { NetworkError, handleError } from '$lib/utils/error-handler';

	type LegendItem = { key: 'canopy' | 'moderate' | 'low' | 'alert'; color: string };
	type MetricKey = 'coverage' | 'vigor' | 'stress' | 'update';

	let mapContainer: HTMLDivElement | null = null;
	let mapInstance: LeafletMap | null = null;
	let userLocation: [number, number] | null = null;

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

	onMount(() => {
		if (!browser || !mapContainer) return;

		try {
			const iconOptions: L.IconOptions = {
				iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
				iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
				shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
			};
			const DefaultIcon = L.icon(iconOptions);
			L.Marker.prototype.options.icon = DefaultIcon;

			mapInstance = L.map(mapContainer).setView([48.8566, 2.3522], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19
			}).addTo(mapInstance);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position: GeolocationPosition) => {
						const lat = position.coords.latitude;
						const lng = position.coords.longitude;
						userLocation = [lat, lng];

						if (mapInstance) {
							mapInstance.setView([lat, lng], 16);

							const marker = L.marker([lat, lng]).addTo(mapInstance);
							const radius = position.coords.accuracy;
							L.circle([lat, lng], { radius }).addTo(mapInstance);

							marker
								.bindPopup('Vous êtes ici')
								.openPopup();
						}
					},
					(error: GeolocationPositionError) => {
						const appError = handleError(error);
						logger.warn('Error getting location', appError);
						if (mapInstance && userLocation) {
							mapInstance.setView(userLocation, 16);
						}
					}
				);
			}
		} catch (error) {
			const appError = handleError(error);
			logger.error('Error initializing map', appError);
		}

		return () => {
			if (mapInstance) {
				mapInstance.remove();
				mapInstance = null;
			}
		};
	});
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
			<div class="relative overflow-hidden rounded-2xl border ui-border-subtle bg-white">
				<div
					bind:this={mapContainer}
					class="h-[420px] w-full rounded-2xl"
					style="z-index: 0;"
				>
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
			</div>
		</div>
	</section>
</div>
