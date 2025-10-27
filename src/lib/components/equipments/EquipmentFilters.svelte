<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { FilterKey } from '$lib/domain/equipments/types';
import { t } from '$lib/i18n';

export let active: FilterKey = 'all';
export let counts: Record<FilterKey, number> = { all: 0, drone: 0, camera: 0 };

const dispatch = createEventDispatcher<{ select: FilterKey }>();

const handleSelect = (key: FilterKey) => {
	dispatch('select', key);
};

type FilterOption = { key: FilterKey; label: string };

$: options = [
	{ key: 'all', label: $t('equipments.filters.all') },
	{ key: 'drone', label: $t('equipments.filters.drones') },
	{ key: 'camera', label: $t('equipments.filters.cameras') }
] satisfies FilterOption[];
</script>

<div class="flex flex-wrap gap-2">
	{#each options as option}
		<button
			type="button"
			class={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
				active === option.key
					? 'bg-slate-900 text-white border-slate-900 shadow-sm'
					: 'ui-border-soft ui-text-secondary hover:border-slate-400 hover:text-slate-900'
			}`}
			on:click={() => handleSelect(option.key)}
			aria-pressed={active === option.key}
		>
			<span>{option.label}</span>
			<span class={`ml-2 rounded-full px-2 py-0.5 text-xs ${active === option.key ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'}`}>
				{counts[option.key] ?? 0}
			</span>
		</button>
	{/each}
</div>
