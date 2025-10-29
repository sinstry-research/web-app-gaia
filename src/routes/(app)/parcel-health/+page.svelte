<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map as LeafletMap } from 'leaflet';
	import type * as LeafletNamespace from 'leaflet';
	import { t } from '$lib/i18n';
	import { logger } from '$lib/utils/logger';
	import { handleError } from '$lib/utils/error-handler';
	import { mapStore } from '$lib/stores/map';
	import { get } from 'svelte/store';

	type LegendItem = { key: 'canopy' | 'moderate' | 'low' | 'alert'; color: string };
	type MetricKey = 'coverage' | 'vigor' | 'stress' | 'update';

	let mapContainer = $state<HTMLDivElement | null>(null);
	let userLocation = $state<[number, number] | null>(null);
	let isLoading = $state(false);
	
	let mapState = $derived(get(mapStore));
	let L = $derived(mapState.leafletLibrary);
	let mapInstance = $derived(mapState.mapInstance);

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

	const legendItems = $derived(legendBase.map((item) => ({
		...item,
		label: $t(`parcelHealth.legend.${item.key}`)
	})));

	const placeholderMetrics = $derived(metricBase.map((item) => ({
		key: item.key,
		value: item.value,
		label: $t(`parcelHealth.metrics.${item.key}.label`),
		caption: $t(`parcelHealth.metrics.${item.key}.caption`)
	})));

	const loadLeaflet = async (): Promise<void> => {
		const currentState = get(mapStore);
		if (currentState.isLoaded && currentState.leafletLibrary) {
			return;
		}

		isLoading = true;
		try {
			const [leafletModule] = await Promise.all([
				import('leaflet'),
				import('leaflet/dist/leaflet.css')
			]);
			mapStore.setLeafletLibrary(leafletModule);
		} catch (error) {
			logger.error('Failed to load Leaflet', error);
		} finally {
			isLoading = false;
		}
	};

	const initializeMap = (leafletLib: typeof LeafletNamespace, container: HTMLDivElement): void => {
		if (!browser || !container) return;

		const currentState = get(mapStore);
		
		let center: [number, number] = [48.8566, 2.3522];
		let zoom = 13;
		
		if (currentState.mapInstance) {
			try {
				const existingMap = currentState.mapInstance;
				const mapCenter = existingMap.getCenter();
				center = [mapCenter.lat, mapCenter.lng];
				zoom = existingMap.getZoom();
				existingMap.remove();
				mapStore.setMapInstance(null);
			} catch (error) {
				logger.warn('Failed to preserve map state, using defaults', error);
			}
		}

		try {
			const iconOptions = {
				iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
				iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
				shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
			};
			const DefaultIcon = leafletLib.icon(iconOptions);
			leafletLib.Marker.prototype.options.icon = DefaultIcon;

			const newMapInstance = leafletLib.map(container).setView(center, zoom);

			leafletLib.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19
			}).addTo(newMapInstance);

			mapStore.setMapInstance(newMapInstance);
			mapStore.setContainer(container);

			const storeState = get(mapStore);
			if (storeState.userLocation) {
				try {
					newMapInstance.setView(storeState.userLocation, 16);
					const marker = leafletLib.marker(storeState.userLocation).addTo(newMapInstance);
					leafletLib.circle(storeState.userLocation, { radius: 50 }).addTo(newMapInstance);
					marker.bindPopup('Vous êtes ici').openPopup();
				} catch (error) {
					logger.warn('Failed to restore user location on map', error);
				}
			} else if (navigator.geolocation && !storeState.geolocationRequested) {
				mapStore.setGeolocationRequested(true);
				navigator.geolocation.getCurrentPosition(
					(position: GeolocationPosition) => {
						const currentStoreState = get(mapStore);
						if (!currentStoreState.mapInstance || !currentStoreState.leafletLibrary) return;
						
						const lat = position.coords.latitude;
						const lng = position.coords.longitude;
						const location: [number, number] = [lat, lng];
						
						userLocation = location;
						mapStore.setUserLocation(location);

						currentStoreState.mapInstance.setView(location, 16);

						const marker = currentStoreState.leafletLibrary.marker(location).addTo(currentStoreState.mapInstance);
						const radius = position.coords.accuracy;
						currentStoreState.leafletLibrary.circle(location, { radius }).addTo(currentStoreState.mapInstance);

						marker
							.bindPopup('Vous êtes ici')
							.openPopup();
					},
					(error: GeolocationPositionError) => {
						const appError = handleError(error);
						logger.warn('Error getting location', appError);
						const currentMap = get(mapStore).mapInstance;
						const storedLocation = get(mapStore).userLocation;
						if (currentMap && storedLocation) {
							currentMap.setView(storedLocation, 16);
						}
					}
				);
			}

			setTimeout(() => {
				try {
					newMapInstance.invalidateSize();
				} catch (error) {
					logger.warn('Failed to invalidate map size after init', error);
				}
			}, 100);
		} catch (error) {
			const appError = handleError(error);
			logger.error('Error initializing map', appError);
		}
	};

	onMount(() => {
		if (!browser) return;

		loadLeaflet().then(() => {
			const currentState = get(mapStore);
			if (!currentState.leafletLibrary || !mapContainer) return;
			
			initializeMap(currentState.leafletLibrary, mapContainer);
		});
	});

	$effect(() => {
		if (mapContainer) {
			const currentState = get(mapStore);
			if (currentState.mapInstance && currentState.leafletLibrary && mapContainer !== currentState.container) {
				initializeMap(currentState.leafletLibrary, mapContainer);
			} else if (currentState.mapInstance && currentState.container && mapContainer === currentState.container) {
				setTimeout(() => {
					const map = get(mapStore).mapInstance;
					if (map) {
						try {
							map.invalidateSize();
						} catch (error) {
							logger.warn('Failed to invalidate map size in effect', error);
						}
					}
				}, 50);
			}
		}
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
			{#if isLoading}
				<div class="flex h-[420px] items-center justify-center ui-text-subtle">
					<div class="text-center">
						<div class="ui-loading-spinner mx-auto mb-4"></div>
						<p class="text-sm">Loading map...</p>
					</div>
				</div>
			{:else}
				<div
					bind:this={mapContainer}
					class="h-[420px] w-full rounded-2xl"
					style="z-index: 0;"
				>
				</div>
			{/if}
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
