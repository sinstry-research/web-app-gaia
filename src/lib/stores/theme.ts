import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const getPreferredTheme = (): Theme => {
	if (!browser) return 'light';

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	const prefersDark =
		typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
	return prefersDark ? 'dark' : 'light';
};

const applyTheme = (value: Theme) => {
	if (!browser) return;

	document.documentElement.dataset.theme = value;
	localStorage.setItem(STORAGE_KEY, value);
};

const themeStore = writable<Theme>(getPreferredTheme());

if (browser) {
	const unsubscribe = themeStore.subscribe(applyTheme);
	applyTheme(getPreferredTheme());

	// Optional: cleanup if module reloaded during HMR
	if (import.meta.hot) {
		import.meta.hot.dispose(() => {
			unsubscribe();
		});
	}
}

export const theme = {
	subscribe: themeStore.subscribe,
	set: (value: Theme) => themeStore.set(value)
};

export const setTheme = (value: Theme) => {
	themeStore.set(value);
};
