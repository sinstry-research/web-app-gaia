<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { Map as MapIcon } from 'lucide-svelte';

	import NavItem from '$lib/components/navigation/NavItem.svelte';
	import { t } from '$lib/i18n';
	import { loading, user } from '$lib/stores/auth';

	const navOrder = ['/', '/parcel-health', '/equipments', '/settings'] as const;
	const SWIPE_THRESHOLD = 100;
	const VERTICAL_DRIFT_LIMIT = 80;

	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;
	let trackingSwipe = false;
	let currentRouteKey: RouteKey = '/';

	type RouteKey = (typeof navOrder)[number];

	const resolveRouteKey = (pathname: string): RouteKey => {
		if (pathname.startsWith('/parcel-health')) {
			return '/parcel-health';
		}
		if (pathname.startsWith('/equipments')) {
			return '/equipments';
		}
		if (pathname.startsWith('/settings')) {
			return '/settings';
		}
		return '/';
	};

	const isMobileViewport = () => browser && window.innerWidth < 768;

	const navigateByOffset = (offset: number) => {
		if (!browser || !offset) return;

		const currentPath = get(page).url.pathname;
		const currentKey = resolveRouteKey(currentPath);
		const currentIndex = navOrder.indexOf(currentKey);

		if (currentIndex === -1) return;

		const targetIndex = currentIndex + offset;
		const targetRoute = navOrder[targetIndex];

		if (!targetRoute || targetRoute === currentKey) return;

		goto(targetRoute);
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (!isMobileViewport() || event.touches.length !== 1) return;

		const touch = event.touches[0];

		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		touchStartTime = performance.now();
		trackingSwipe = true;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (!trackingSwipe || event.changedTouches.length !== 1) {
			trackingSwipe = false;
			return;
		}

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		const elapsed = performance.now() - touchStartTime;

		trackingSwipe = false;

		if (!isMobileViewport()) return;
		if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
		if (Math.abs(deltaY) > VERTICAL_DRIFT_LIMIT) return;
		if (elapsed > 600) return;

		navigateByOffset(deltaX < 0 ? 1 : -1);
	};

	const handleTouchCancel = () => {
		trackingSwipe = false;
	};

	$: currentRouteKey = resolveRouteKey($page.url.pathname);
</script>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
		<div class="text-center">
			<div class="ui-loading-spinner mx-auto mb-4"></div>
			<p class="ui-text-tertiary">{$t('common.loading')}</p>
		</div>
	</div>
{:else if !$user}
	<slot name="fallback"></slot>
{:else}
	<div class="flex h-screen">
		<aside
			class="ui-surface-overlay ui-border-soft ui-text-primary fixed bottom-4 left-4 right-4 z-30 flex h-16 flex-col rounded-full border text-sm md:static md:m-2 md:h-auto md:w-16 md:rounded-lg"
		>
			<nav class="flex-1">
				<ul
					class="flex h-full w-full flex-row items-center gap-x-2 px-2 md:flex-col md:items-stretch md:gap-x-0 md:gap-y-2 md:px-0 md:py-2"
				>
					<NavItem href="/" label={$t('common.home')} active={currentRouteKey === '/'}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 48 48"
							class="h-6 w-6 flex-shrink-0"
							aria-label={$t('common.home')}
						>
							<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
								<path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
								<path stroke-linecap="round" d="M24 36c6.627 0 12-5.373 12-12" />
							</g>
						</svg>
					</NavItem>
					<NavItem
						href="/parcel-health"
						label={$t('common.parcelHealth')}
						active={currentRouteKey === '/parcel-health'}
					>
						<MapIcon class="h-6 w-6 flex-shrink-0" />
					</NavItem>
					<NavItem href="/equipments" label={$t('common.equipments')} active={currentRouteKey === '/equipments'}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="h-6 w-6 flex-shrink-0"
							aria-label={$t('common.equipments')}
						>
							<path fill="currentColor" d="m21.71 20.29l-1.42 1.42a1 1 0 0 1-1.41 0L7 9.85A3.8 3.8 0 0 1 6 10a4 4 0 0 1-3.78-5.3l2.54 2.54l.53-.53l1.42-1.42l.53-.53L4.7 2.22A4 4 0 0 1 10 6a3.8 3.8 0 0 1-.15 1l11.86 11.88a1 1 0 0 1 0 1.41M2.29 18.88a1 1 0 0 0 0 1.41l1.42 1.42a1 1 0 0 0 1.41 0l5.47-5.46l-2.83-2.83M20 2l-4 2v2l-2.17 2.17l2 2L18 8h2l2-4Z" />
						</svg>
					</NavItem>
					<NavItem href="/settings" align="end" label={$t('common.settings')} active={currentRouteKey === '/settings'}>
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
		<main
			class="flex-1 overflow-y-auto overflow-x-hidden pt-4 pr-4 pb-24 pl-4 md:pb-4 md:pl-2"
			on:touchstart|passive={handleTouchStart}
			on:touchend={handleTouchEnd}
			on:touchcancel={handleTouchCancel}
		>
			<slot></slot>
		</main>
	</div>
{/if}
