<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FilterKey } from '$lib/domain/equipments/types';
	import { t } from '$lib/i18n';
	import type { EquipmentFiltersEvents } from './events';

	interface Props {
		active?: FilterKey;
		counts?: Record<FilterKey, number>;
	}

	const { active = 'all', counts = { all: 0, drone: 0, camera: 0 } }: Props = $props();

	const dispatch = createEventDispatcher<EquipmentFiltersEvents>();

	const handleSelect = (key: FilterKey) => {
		dispatch('select', key);
	};

	type FilterOption = { key: FilterKey; label: string };

	const options = $derived([
		{ key: 'all', label: $t('equipments.filters.all') },
		{ key: 'drone', label: $t('equipments.filters.drones') },
		{ key: 'camera', label: $t('equipments.filters.cameras') }
	] satisfies FilterOption[]);
</script>

<div class="flex flex-wrap gap-2">
	{#each options as option}
		<button
			type="button"
			class="equipment-filter"
			class:is-active={active === option.key}
			onclick={() => handleSelect(option.key)}
			aria-pressed={active === option.key}
		>
			<span>{option.label}</span>
			<span class="ml-2 rounded-full bg-[var(--ui-surface-soft)] px-2 py-0.5 text-xs text-[var(--ui-text-tertiary)]">
				{counts[option.key] ?? 0}
			</span>
		</button>
	{/each}
</div>
