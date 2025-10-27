<script lang="ts">
	import {
		Battery,
		Camera,
		CalendarClock,
		Gauge,
		MapPin,
		Navigation,
		Plane,
		Radio,
		ShieldCheck,
		Target,
		Video,
		Wind
	} from 'lucide-svelte';

	import type { Equipment, FilterKey } from '$lib/domain/equipments/types';
	import { statusStyles, typeStyles } from '$lib/domain/equipments/styles';
	import { formatDate } from '$lib/domain/equipments/utils';
	import { t } from '$lib/i18n';

	export let equipments: Equipment[] = [];
	export let filter: FilterKey = 'all';
	export let locale = 'en';

	$: emptyMessage =
		filter === 'drone'
			? $t('equipments.empty.drones')
			: filter === 'camera'
				? $t('equipments.empty.cameras')
				: $t('equipments.empty.all');
</script>

{#if equipments.length === 0}
	<div class="ui-empty-state">
		{emptyMessage}
	</div>
{:else}
	<div class="grid gap-4 lg:grid-cols-2">
		{#each equipments as equipment (equipment.id)}
			<div class="ui-panel flex h-full flex-col gap-5 p-6">
				<div class="flex items-start justify-between gap-4">
					<div class="flex items-start gap-3">
						<div class={`rounded-xl p-2 ${typeStyles[equipment.type].background} ${typeStyles[equipment.type].text}`}>
							{#if equipment.type === 'drone'}
								<Plane size={20} />
							{:else}
								<Camera size={20} />
							{/if}
						</div>
						<div>
							<h3 class="text-lg font-semibold ui-text-primary">{equipment.name}</h3>
							<p class="text-sm ui-text-subtle">
								{$t('equipments.details.identifier')}: {equipment.identifier}
							</p>
						</div>
					</div>
					<span
						class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[equipment.status].badge}`}
					>
						<span class={`h-2 w-2 rounded-full ${statusStyles[equipment.status].dot}`}></span>
						{$t(`equipments.statuses.${equipment.status}`)}
					</span>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-3 text-sm ui-text-muted">
						<div class="flex items-center gap-2">
							<MapPin class="text-slate-500" size={18} />
							<span>
								{$t('equipments.details.location')}:
								<span class="ml-1 font-medium ui-text-secondary">{equipment.location}</span>
							</span>
						</div>
						<div class="flex items-center gap-2">
							<ShieldCheck class="text-emerald-500" size={18} />
							<span>
								{$t('equipments.details.health')}:
								<span class="ml-1 font-medium ui-text-secondary">{equipment.health}%</span>
							</span>
						</div>
						<div class="flex items-center gap-2">
							<CalendarClock class="ui-text-muted" size={18} />
							<span>
								{$t('equipments.details.lastCheck')}:
								<span class="ml-1 font-medium ui-text-secondary">{formatDate(equipment.lastCheck, locale)}</span>
							</span>
						</div>
					</div>

					<div class="space-y-3 text-sm ui-text-muted">
						{#if equipment.type === 'drone'}
							<div>
								<div class="flex items-center gap-2">
									<Battery class="text-emerald-500" size={18} />
									<span>
										{$t('equipments.battery')}:
										<span class="ml-1 font-medium ui-text-secondary">{equipment.battery}%</span>
									</span>
								</div>
								<div class="ui-surface-soft mt-2 h-2 w-full rounded-full">
									<div
										class="h-2 rounded-full bg-emerald-500"
										style={`width: ${Math.min(equipment.battery, 100)}%`}
									></div>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<Navigation class="text-slate-500" size={18} />
								<span>
									{$t('equipments.altitude')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.altitude} m</span>
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Wind class="text-slate-500" size={18} />
								<span>
									{$t('equipments.speed')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.speed} km/h</span>
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Target class="text-slate-500" size={18} />
								<span>
									{$t('equipments.form.mission')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.mission}</span>
								</span>
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<Video class="text-slate-500" size={18} />
								<span>
									{$t('equipments.form.resolution')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.resolution}</span>
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Gauge class="text-slate-500" size={18} />
								<span>
									{$t('equipments.form.fieldOfView')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.fieldOfView}&deg;</span>
								</span>
							</div>
							<div class="flex items-center gap-2">
								<CalendarClock class="ui-text-muted" size={18} />
								<span>
									{$t('equipments.form.lastService')}:
									<span class="ml-1 font-medium ui-text-secondary">{formatDate(equipment.lastService, locale)}</span>
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Radio class="text-slate-500" size={18} />
								<span>
									{$t('equipments.form.connectivity')}:
									<span class="ml-1 font-medium ui-text-secondary">{equipment.connectivity}</span>
								</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
