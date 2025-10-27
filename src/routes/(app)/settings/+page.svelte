<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { get } from 'svelte/store';
	import { LogOut, Moon, Sun, User } from 'lucide-svelte';

	import { languages, setLocale, currentLocale, t, type Locale } from '$lib/i18n';
	import { theme, setTheme, type Theme } from '$lib/stores/theme';
	import { signOutUser, user } from '$lib/stores/auth';

	let selectedLanguage: Locale = 'en';
	let selectedTheme: Theme = 'light';

	$: selectedLanguage = $currentLocale;
	$: selectedTheme = $theme;

	onMount(() => {
		if (!browser) return;
		selectedLanguage = get(currentLocale);
		selectedTheme = get(theme);
	});

	const handleLanguageChange = (lang: Locale) => {
		setLocale(lang);
	};

	const handleThemeChange = (value: Theme) => {
		setTheme(value);
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();
		} catch (error) {
			console.error('Sign out failed:', error);
		}
	};
</script>

<svelte:head>
	<title>GAIA | {$t('settings.title')}</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-3xl font-semibold ui-text-primary">{$t('settings.title')}</h1>

	<div class="ui-card p-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				{#if $user?.photoURL}
					<img src={$user.photoURL} alt="Profile" class="h-16 w-16 rounded-full border-2 ui-border-strong" />
				{:else}
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
						<User class="h-8 w-8" />
					</div>
				{/if}
				<div>
					<h2 class="text-xl font-semibold ui-text-primary">
						{$user?.displayName || $t('common.user')}
					</h2>
					<p class="ui-text-tertiary text-sm">{$user?.email}</p>
					<p class="ui-text-muted text-xs">{$t('common.connectedWithGoogle')}</p>
				</div>
			</div>
			<button
				type="button"
				class="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
				on:click={handleSignOut}
			>
				<LogOut size={16} />
				{$t('common.signOut')}
			</button>
		</div>
	</div>

	<div class="ui-card space-y-6 p-6">
		<div>
			<label for="language" class="block text-sm font-medium ui-text-secondary">
				{$t('settings.language')}
			</label>
			<select
				id="language"
				class="mt-2 block w-full rounded-xl border ui-border-subtle px-3 py-2 text-sm ui-text-secondary focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
				bind:value={selectedLanguage}
				on:change={(event) => handleLanguageChange((event.target as HTMLSelectElement).value as Locale)}
			>
				{#each languages as lang}
					<option value={lang.code}>{lang.label}</option>
				{/each}
			</select>
		</div>

		<div class="border-t ui-border-subtle pt-4">
			<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
				<span class="text-sm font-medium ui-text-secondary">{$t('settings.theme')}</span>
				<span class="text-xs ui-text-muted sm:text-right">{$t('settings.themeDescription')}</span>
			</div>
			<div class="mt-3 grid gap-2 sm:grid-cols-2">
				<button
					type="button"
					class={`ui-theme-card ${selectedTheme === 'light' ? 'is-active-light' : ''}`}
					on:click={() => handleThemeChange('light')}
				>
					<Sun size={16} />
					<span>{$t('settings.themeLight')}</span>
				</button>
				<button
					type="button"
					class={`ui-theme-card ${selectedTheme === 'dark' ? 'is-active-dark' : ''}`}
					on:click={() => handleThemeChange('dark')}
				>
					<Moon size={16} />
					<span>{$t('settings.themeDark')}</span>
				</button>
			</div>
		</div>
	</div>
</div>
