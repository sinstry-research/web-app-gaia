import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

import en from './locales/en';
import fr from './locales/fr';
import type { NestedKeyOf } from './types';
import { languageOptions } from './languages';

const dictionaries = {
	en,
	fr
} as const;

export type Locale = keyof typeof dictionaries;
export type TranslationSchema = (typeof dictionaries)[Locale];
export type TranslationKey = NestedKeyOf<TranslationSchema>;

const STORAGE_KEY = 'language';

const isValidLocale = (value: unknown): value is Locale =>
	typeof value === 'string' && value in dictionaries;

const createLocaleStore = () => {
	const store = writable<Locale>('en');

	if (browser) {
		const storedLocale = localStorage.getItem(STORAGE_KEY);
		if (isValidLocale(storedLocale)) {
			store.set(storedLocale);
		}

		store.subscribe((value) => {
			localStorage.setItem(STORAGE_KEY, value);
		});
	}

	return store;
};

export const currentLocale = createLocaleStore();

export const currentTranslations = derived(currentLocale, ($locale) => dictionaries[$locale]);

const resolveKey = (dictionary: TranslationSchema, key: TranslationKey) => {
	const segments = key.split('.');
	let current: unknown = dictionary;

	for (const segment of segments) {
		if (typeof current !== 'object' || current === null || !(segment in current)) {
			return undefined;
		}

		current = (current as Record<string, unknown>)[segment];
	}

	return typeof current === 'string' ? current : undefined;
};

export const t = derived(currentLocale, ($locale) => {
	const dictionary = dictionaries[$locale];

	return (key: TranslationKey, fallback?: string) => resolveKey(dictionary, key) ?? fallback ?? key;
});

export const getTranslation = (key: TranslationKey, fallback?: string) => {
	const dictionary = get(currentTranslations);
	return resolveKey(dictionary, key) ?? fallback ?? key;
};

export const setLocale = (locale: Locale) => {
	if (!isValidLocale(locale)) {
		throw new Error(`Unsupported locale: ${locale}`);
	}

	currentLocale.set(locale);
};

export const locales = (languageOptions.map((option) => option.code) as readonly Locale[]);
export const languages = languageOptions;
