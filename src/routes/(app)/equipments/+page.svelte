<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import EquipmentFilters from '$lib/components/equipments/EquipmentFilters.svelte';
	import EquipmentFormModal from '$lib/components/equipments/EquipmentFormModal.svelte';
	import EquipmentList from '$lib/components/equipments/EquipmentList.svelte';
	import { initialEquipments } from '$lib/domain/equipments/data';
	import { createEquipmentFromForm, getDefaultForm } from '$lib/domain/equipments/utils';
	import type { Equipment, EquipmentForm, FilterKey } from '$lib/domain/equipments/types';
	import { currentLocale, t } from '$lib/i18n';

	let equipments: Equipment[] = [...initialEquipments];
	let activeFilter: FilterKey = 'all';
	let modalOpen = false;
	let draftForm: EquipmentForm = getDefaultForm();

	$: filteredEquipments =
		activeFilter === 'all' ? equipments : equipments.filter((item) => item.type === activeFilter);

	$: filterCounts = {
		all: equipments.length,
		drone: equipments.filter((item) => item.type === 'drone').length,
		camera: equipments.filter((item) => item.type === 'camera').length
	};

	$: locale = $currentLocale;

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
		const newEquipment = createEquipmentFromForm(event.detail);
		equipments = [newEquipment, ...equipments];
		if (activeFilter !== 'all' && activeFilter !== newEquipment.type) {
			activeFilter = 'all';
		}
		closeForm();
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
		<button class="ui-primary-button" on:click={openForm}>
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

		<EquipmentList equipments={filteredEquipments} filter={activeFilter} {locale} />
	</section>
</div>

<EquipmentFormModal
	open={modalOpen}
	initialForm={draftForm}
	on:close={closeForm}
	on:submit={handleSubmit}
/>
