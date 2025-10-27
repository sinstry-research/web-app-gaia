import type { EquipmentStatus, EquipmentType } from './types';

export const statusStyles: Record<
	EquipmentStatus,
	{
		badge: string;
		dot: string;
	}
> = {
	operational: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
	standby: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
	maintenance: { badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' }
};

export const typeStyles: Record<
	EquipmentType,
	{
		background: string;
		text: string;
	}
> = {
	drone: { background: 'bg-slate-100', text: 'text-slate-700' },
	camera: { background: 'bg-slate-200', text: 'text-slate-800' }
};
