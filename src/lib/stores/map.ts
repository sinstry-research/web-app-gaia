import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Map as LeafletMap } from 'leaflet';
import type * as LeafletNamespace from 'leaflet';

interface MapStore {
	mapInstance: LeafletMap | null;
	leafletLibrary: typeof LeafletNamespace | null;
	isLoaded: boolean;
	container: HTMLDivElement | null;
	userLocation: [number, number] | null;
	geolocationRequested: boolean;
}

const createMapStore = () => {
	const { subscribe, set, update } = writable<MapStore>({
		mapInstance: null,
		leafletLibrary: null,
		isLoaded: false,
		container: null,
		userLocation: null,
		geolocationRequested: false
	});

	return {
		subscribe,
		set,
		update,
		setMapInstance: (instance: LeafletMap | null) => {
			update((state) => ({ ...state, mapInstance: instance }));
		},
		setLeafletLibrary: (library: typeof LeafletNamespace | null) => {
			update((state) => ({ ...state, leafletLibrary: library, isLoaded: !!library }));
		},
		setContainer: (container: HTMLDivElement | null) => {
			update((state) => ({ ...state, container }));
		},
		setUserLocation: (location: [number, number] | null) => {
			update((state) => ({ ...state, userLocation: location }));
		},
		setGeolocationRequested: (requested: boolean) => {
			update((state) => ({ ...state, geolocationRequested: requested }));
		},
		clear: () => {
			set({
				mapInstance: null,
				leafletLibrary: null,
				isLoaded: false,
				container: null,
				userLocation: null,
				geolocationRequested: false
			});
		}
	};
};

export const mapStore = createMapStore();

