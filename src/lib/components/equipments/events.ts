import type { EquipmentForm, FilterKey } from '$lib/domain/equipments/types';

export interface EquipmentFormModalEvents {
	close: void;
	submit: EquipmentForm;
}

export interface EquipmentFiltersEvents {
	select: FilterKey;
}

