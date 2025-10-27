<script lang="ts">
	import { page } from '$app/stores';
	import { Map as MapIcon } from 'lucide-svelte';

	import NavItem from '$lib/components/navigation/NavItem.svelte';
	import { t } from '$lib/i18n';
	import { loading, user } from '$lib/stores/auth';
</script>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
		<div class="text-center">
			<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900"></div>
			<p class="ui-text-tertiary">{$t('common.loading')}</p>
		</div>
	</div>
{:else if !$user}
	<slot name="fallback"></slot>
{:else}
	<div class="flex h-screen">
		<aside
			class="ui-surface-overlay ui-border-soft ui-shadow-soft ui-text-primary fixed bottom-4 left-4 right-4 z-30 flex h-16 flex-col rounded-full border text-sm md:static md:m-4 md:h-auto md:w-16 md:rounded-lg"
		>
			<nav class="flex-1">
				<ul
					class="flex h-full w-full flex-row items-center gap-x-2 px-2 md:flex-col md:justify-start md:gap-x-0 md:gap-y-2 md:px-0"
				>
					<NavItem href="/" label={$t('common.home')} active={$page.url.pathname === '/'}>
						<img src="/icon-black.svg" alt={$t('common.home')} class="h-6 w-6 flex-shrink-0" />
					</NavItem>
					<NavItem
						href="/parcel-health"
						label={$t('common.parcelHealth')}
						active={$page.url.pathname.startsWith('/parcel-health')}
					>
						<MapIcon class="h-6 w-6 flex-shrink-0" />
					</NavItem>
					<NavItem href="/equipments" label={$t('common.equipments')} active={$page.url.pathname === '/equipments'}>
						<img src="/equipment.svg" alt={$t('common.equipments')} class="h-6 w-6 flex-shrink-0" />
					</NavItem>
					<NavItem href="/settings" align="end" label={$t('common.settings')} active={$page.url.pathname === '/settings'}>
						{#if $user?.photoURL}
							<img src={$user.photoURL} alt={$t('common.settings')} class="h-6 w-6 flex-shrink-0 rounded-full" />
						{:else}
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
								{$user?.displayName?.charAt(0) || $user?.email?.charAt(0) || 'U'}
							</div>
						{/if}
					</NavItem>
				</ul>
			</nav>
		</aside>
		<main class="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
			<slot></slot>
		</main>
	</div>
{/if}
