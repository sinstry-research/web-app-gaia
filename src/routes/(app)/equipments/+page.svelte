<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import EquipmentFilters from '$lib/components/equipments/EquipmentFilters.svelte';
	import EquipmentList from '$lib/components/equipments/EquipmentList.svelte';
	import EquipmentFormModal from '$lib/components/equipments/EquipmentFormModal.svelte';
	import { initialEquipments } from '$lib/domain/equipments/data';
	import { createEquipmentFromForm, getDefaultForm } from '$lib/domain/equipments/utils';
	import type { Equipment, EquipmentForm, FilterKey } from '$lib/domain/equipments/types';
	import { currentLocale, t } from '$lib/i18n';
	import type { EquipmentFormModalEvents } from '$lib/components/equipments/events';
	import type { EquipmentFiltersEvents } from '$lib/components/equipments/events';
	import { logger } from '$lib/utils/logger';
	import { ValidationError } from '$lib/utils/error-handler';

	let equipments = $state<Equipment[]>([...initialEquipments]);
	let activeFilter = $state<FilterKey>('all');
	let modalOpen = $state(false);
	let draftForm = $state<EquipmentForm>(getDefaultForm());

	const filterCounts = $derived({
		all: equipments.length,
		drone: equipments.filter((item) => item.type === 'drone').length,
		camera: equipments.filter((item) => item.type === 'camera').length
	});

	const memoizedFilteredEquipments = $derived.by(() => {
		if (activeFilter === 'all') return equipments;
		return equipments.filter((item) => item.type === activeFilter);
	});

	const locale = $derived($currentLocale);

	const openForm = () => {
		draftForm = getDefaultForm();
		modalOpen = true;
	};

	const closeForm = () => {
		modalOpen = false;
	};

	const handleFilterChange = (event: CustomEvent<FilterKey>) => {
		activeFilter = event.detail;
	};

	const handleSubmit = (event: CustomEvent<EquipmentForm>) => {
		try {
			const newEquipment = createEquipmentFromForm(event.detail);
			equipments = [newEquipment, ...equipments];
			if (activeFilter !== 'all' && activeFilter !== newEquipment.type) {
				activeFilter = 'all';
			}
			closeForm();
		} catch (error) {
			logger.error('Failed to create equipment from form', error);
			if (error instanceof ValidationError) {
				logger.error('Validation error when creating equipment', error);
			}
		}
	};
</script>

<svelte:head>
	<title>GAIA | {$t('equipments.title')}</title>
</svelte:head>

<div class="flex h-full flex-col gap-6">
	<header
		class="ui-surface-overlay ui-border-soft flex flex-col gap-3 rounded-2xl border p-6 lg:flex-row lg:items-center lg:justify-between"
	>
		<div class="max-w-2xl space-y-1">
			<h1 class="text-3xl font-semibold ui-text-primary">
				{$t('equipments.title')}
			</h1>
			<p class="text-sm ui-text-muted">
				{$t('equipments.actions.addDescription')}
			</p>
		</div>
		<button class="ui-primary-button" onclick={openForm}>
			<Plus size={18} />
			<span>{$t('equipments.actions.add')}</span>
		</button>
	</header>

	<section class="ui-surface-overlay ui-border-soft flex flex-col gap-6 rounded-2xl border p-6 lg:p-8">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<h2 class="text-lg font-semibold ui-text-primary">
				{$t('equipments.filters.all')}
			</h2>
			<EquipmentFilters active={activeFilter} counts={filterCounts} on:select={handleFilterChange} />
		</div>

		<EquipmentList equipments={memoizedFilteredEquipments} filter={activeFilter} {locale} />
	</section>
</div>

	{#if modalOpen}
		<EquipmentFormModal
			open={modalOpen}
			initialForm={draftForm}
			on:close={closeForm}
			on:submit={handleSubmit}
		/>
	{/if}
