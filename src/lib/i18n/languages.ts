export const languageOptions = [
	{ code: 'en', label: 'English' },
	{ code: 'fr', label: 'Français' }
] as const;

export type SupportedLanguage = (typeof languageOptions)[number]['code'];
