import { getTranslation } from '$lib/i18n';

import type { BaseEquipment, Equipment, EquipmentForm } from './types';

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const getDefaultForm = (): EquipmentForm => ({
	type: 'drone',
	name: '',
	identifier: '',
	location: '',
	status: 'operational',
	battery: 85,
	altitude: 120,
	speed: 18,
	resolution: '4K HDR',
	fieldOfView: 120,
	lastService: todayIso(),
	connectivity: 'PoE',
	mission: ''
});

export const createEquipmentFromForm = (form: EquipmentForm): Equipment => {
	const base: BaseEquipment = {
		id: form.identifier.trim(),
		identifier: form.identifier.trim(),
		name: form.name.trim(),
		type: form.type,
		status: form.status,
		location: form.location.trim(),
		health: Math.min(
			100,
			Math.max(
				60,
				Math.round(form.type === 'drone' ? 70 + Math.random() * 25 : 75 + Math.random() * 20)
			)
		),
		lastCheck: todayIso()
	};

	if (form.type === 'drone') {
		return {
			...base,
			type: 'drone',
			battery: Math.max(0, Math.min(100, Math.round(form.battery))),
			altitude: Math.max(0, Math.round(form.altitude)),
			speed: Math.max(0, Math.round(form.speed)),
			mission: form.mission.trim() || getTranslation('equipments.form.mission', 'Mission in progress')
		};
	}

	return {
		...base,
		type: 'camera',
		resolution: form.resolution.trim() || '4K',
		fieldOfView: Math.max(20, Math.round(form.fieldOfView || 0)),
		lastService: form.lastService || base.lastCheck,
		connectivity: form.connectivity.trim() || 'PoE'
	};
};

export const formatDate = (value: string, locale: string) => {
	if (!value) return '--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
		day: '2-digit',
		month: 'short'
	}).format(date);
};
