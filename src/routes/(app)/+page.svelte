<script lang="ts">
	import { onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	import {
		Radar,
		Activity,
		Timer,
		ShieldCheck,
		Thermometer,
		Droplets,
		Wind,
		Leaf,
		Flame,
		AlertTriangle,
		CheckCircle2
	} from 'lucide-svelte';

	import Sparkline from '$lib/components/charts/Sparkline.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { user } from '$lib/stores/auth';
	import { t } from '$lib/i18n';

	let isDay = true;

	onMount(() => {
		const hour = new Date().getHours();
		isDay = hour >= 6 && hour < 18;
	});

	const weeklyFlightHours = [3.8, 4.6, 5.4, 5.9, 6.2, 6.0, 6.4];
	const alertTrendSeries = [5, 4, 4, 3, 3, 2, 2];
	const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const missionSuccessRate = 92;
	const alertChange = '-18%';

	type AlertStatus = 'critical' | 'caution' | 'stable';

	const liveAlertsSource: Array<{
		zone: string;
		detail: string;
		status: AlertStatus;
		time: string;
		type: string;
	}> = [
		{ zone: 'Parcel A3', detail: 'Thermal plume detected', status: 'critical', time: '2m', type: 'Fire' },
		{ zone: 'North slope', detail: 'Leaf moisture drop', status: 'caution', time: '9m', type: 'Humidity' },
		{ zone: 'South gate', detail: 'Unscheduled motion', status: 'stable', time: '18m', type: 'Intrusion' }
	];

	const statusStyles: Record<
		AlertStatus,
		{
			label: string;
			icon: ComponentType;
			toneClass: string;
			dotClass: string;
		}
	> = {
		critical: { label: 'Critical', icon: Flame, toneClass: 'text-rose-600', dotClass: 'bg-rose-500' },
		caution: { label: 'Caution', icon: AlertTriangle, toneClass: 'text-amber-500', dotClass: 'bg-amber-500' },
		stable: { label: 'Stable', icon: CheckCircle2, toneClass: 'text-emerald-600', dotClass: 'bg-emerald-500' }
	};

	let quickStats: Array<{
		icon: ComponentType;
		color?: string;
		title: string;
		value: string | number;
		description?: string;
		change?: string;
		changeTone?: 'positive' | 'negative' | 'neutral';
	}> = [];

	let heroMetrics: Array<{
		label: string;
		value: string;
		caption: string;
		tone: 'positive' | 'negative' | 'neutral';
	}> = [];

	let environmentReadings: Array<{
		icon: ComponentType;
		label: string;
		value: string;
		fill: number;
		color: string;
		caption: string;
	}> = [];

	let liveAlerts: Array<{
		zone: string;
		type: string;
		detail: string;
		time: string;
		severity: string;
		icon: ComponentType;
		toneClass: string;
		dotClass: string;
	}> = [];

	const getUserFirstName = () => {
		if ($user?.displayName) {
			return $user.displayName.split(' ')[0];
		}
		return '';
	};

	$: greetingMessage = (() => {
		const baseGreeting = isDay ? $t('dashboard.greeting_day') : $t('dashboard.greeting_night');
		const firstName = getUserFirstName();
		return firstName ? `${baseGreeting} ${firstName}` : baseGreeting;
	})();

	$: averageFlightHours = (
		weeklyFlightHours.reduce((sum, value) => sum + value, 0) / weeklyFlightHours.length
	).toFixed(1);

	$: heroMetrics = [
		{ label: $t('dashboard.weeklyFlightHours'), value: `${averageFlightHours} h`, caption: 'per drone (7d)', tone: 'neutral' },
		{ label: $t('dashboard.missionSuccessRate'), value: `${missionSuccessRate}%`, caption: '+3 pts vs last week', tone: 'positive' },
		{ label: $t('dashboard.fireDetected'), value: '2', caption: 'past 24h', tone: 'neutral' }
	];

	$: quickStats = [
		{
			icon: Radar,
			title: $t('dashboard.activeDrones'),
			value: 6,
			description: `${$t('dashboard.lastUpdated')} / 2m`,
			change: '+1 mission',
			changeTone: 'positive'
		},
		{
			icon: Activity,
			title: $t('dashboard.missionsToday'),
			value: 34,
			description: '24h rolling',
			change: '21 complete',
			changeTone: 'neutral'
		},
		{
			icon: Timer,
			title: $t('dashboard.avgResponseTime'),
			value: '3m 08s',
			description: '95p 3m 54s',
			change: '-12%',
			changeTone: 'positive'
		},
		{
			icon: ShieldCheck,
			title: $t('dashboard.detectionsResolved'),
			value: '87%',
			description: 'Tracking this week',
			change: '+4%',
			changeTone: 'positive'
		}
	];

	$: environmentReadings = [
		{
			icon: Droplets,
			label: $t('dashboard.humidity'),
			value: '68%',
			fill: 68,
			color: '#22d3ee',
			caption: 'Target range 60-75%'
		},
		{
			icon: Thermometer,
			label: $t('dashboard.temperature'),
			value: '21°C',
			fill: 56,
			color: '#f97316',
			caption: 'Rising +2°C vs avg'
		},
		{
			icon: Wind,
			label: $t('dashboard.windSpeed'),
			value: '14 km/h',
			fill: 35,
			color: '#6366f1',
			caption: 'Stable conditions'
		},
		{
			icon: Leaf,
			label: $t('dashboard.airQuality'),
			value: '0.79 NDVI',
			fill: 79,
			color: '#16a34a',
			caption: 'Healthy vegetation'
		}
	];

	$: liveAlerts = liveAlertsSource.map((alert) => {
		const style = statusStyles[alert.status];
		return {
			...alert,
			severity: style.label,
			icon: style.icon,
			toneClass: style.toneClass,
			dotClass: style.dotClass
		};
	});
</script>

<svelte:head>
	<title>GAIA | {$t('dashboard.title')}</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<section class="grid gap-4 lg:grid-cols-[2fr,3fr]">
		<div class="ui-panel flex flex-col justify-between p-6">
			<div>
				<p class="text-sm ui-text-subtle">{isDay ? 'Sunrise session' : 'Night operations'}</p>
				<h1 class="ui-text-primary mt-3 text-3xl font-semibold">
					{greetingMessage}
				</h1>
				<p class="ui-text-subtle mt-2 text-sm">
					{$t('dashboard.overview')}
				</p>
				<p class="mt-2 text-sm ui-text-subtle">
					{$t('dashboard.lastUpdated')}: 2m
				</p>
			</div>
			<div class="mt-8">
				<Sparkline
					data={weeklyFlightHours}
					labels={weekLabels}
					stroke="#6366f1"
					fill="rgba(99,102,241,0.12)"
					height={160}
					tooltipLabel={$t('dashboard.weeklyFlightHours')}
				/>
				<div class="mt-4 flex justify-between text-xs ui-text-subtle">
					{#each weekLabels as label}
						<span>{label}</span>
					{/each}
				</div>
			</div>
		</div>
		<div class="ui-panel flex flex-col gap-4 p-6">
			<p class="ui-title">{$t('dashboard.environmentReadings')}</p>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{#each heroMetrics as metric}
					<div class="rounded-xl border ui-border-subtle ui-surface-base p-4">
						<p class="text-xs font-medium uppercase tracking-wide ui-text-subtle">{metric.label}</p>
						<p class="mt-2 text-2xl font-semibold ui-text-primary">{metric.value}</p>
						<p
							class={`mt-1 text-xs ${
								metric.tone === 'positive'
									? 'text-emerald-600'
									: metric.tone === 'negative'
										? 'text-rose-600'
										: 'ui-text-subtle'
							}`}
						>
							{metric.caption}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each quickStats as stat}
			<StatCard
				icon={stat.icon}
				color={stat.color ?? 'slate'}
				title={stat.title}
				value={stat.value}
				description={stat.description}
				change={stat.change}
				changeTone={stat.changeTone}
				orientation="vertical"
			/>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr,1fr]">
		<div class="ui-panel p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="ui-title">{$t('dashboard.alertTrend')}</p>
					<p class="mt-1 text-sm ui-text-subtle">Rolling 7 days</p>
				</div>
				<span class={`text-sm font-medium ${alertChange.startsWith('-') ? 'text-emerald-600' : 'text-rose-600'}`}>
					{alertChange}
				</span>
			</div>
			<div class="mt-6">
				<Sparkline
					data={alertTrendSeries}
					labels={weekLabels}
					stroke="#f97316"
					fill="rgba(249,115,22,0.08)"
					height={140}
					showDots
					tooltipLabel={$t('dashboard.alertTrend')}
				/>
			</div>
			<div class="mt-4 flex justify-between text-xs ui-text-subtle">
				{#each weekLabels as label}
					<span>{label}</span>
				{/each}
			</div>
		</div>

		<div class="ui-panel p-6">
			<div class="flex items-center justify-between">
				<p class="ui-title">{$t('dashboard.liveAlerts')}</p>
				<span class="text-xs ui-text-subtle">{liveAlerts.length} active</span>
			</div>
			<ul class="mt-6 space-y-4">
				{#each liveAlerts as alert}
					<li class="flex items-start justify-between gap-6 text-sm ui-text-tertiary">
						<div>
							<p class="font-medium ui-text-primary">{alert.type}</p>
							<p class="mt-1 text-xs ui-text-subtle">{alert.zone} / {alert.detail}</p>
						</div>
						<div class="text-right">
							<span class={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium ${alert.toneClass}`}>
								<svelte:component this={alert.icon} size={14} />
								<span class={`h-2 w-2 rounded-full ${alert.dotClass}`}></span>
								{alert.severity}
							</span>
							<p class="mt-2 text-xs ui-text-subtle">{alert.time}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
		{#each environmentReadings as reading}
			<div class="ui-panel p-5">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium ui-text-tertiary">{reading.label}</p>
						<p class="mt-2 text-xl font-semibold ui-text-primary">{reading.value}</p>
					</div>
					<svelte:component this={reading.icon} size={18} class="ui-text-subtle" />
				</div>
				<div class="ui-surface-soft mt-4 h-1.5 w-full rounded-full">
					<div class="h-full rounded-full" style={`width: ${reading.fill}%; background-color: ${reading.color};`}></div>
				</div>
				<p class="mt-2 text-xs ui-text-subtle">{reading.caption}</p>
			</div>
		{/each}
	</section>
</div>
