import type { Equipment } from './types';

export const initialEquipments: Equipment[] = [
	{
		id: 'DR-204',
		identifier: 'DR-204',
		name: 'Aquila 204',
		type: 'drone',
		status: 'operational',
		location: 'Parcel A3 ridge',
		health: 92,
		lastCheck: '2024-10-18',
		battery: 78,
		altitude: 120,
		speed: 22,
		mission: 'Infrared sweep'
	},
	{
		id: 'DR-219',
		identifier: 'DR-219',
		name: 'Sparrow 2',
		type: 'drone',
		status: 'standby',
		location: 'Hangar B',
		health: 86,
		lastCheck: '2024-10-15',
		battery: 64,
		altitude: 0,
		speed: 0,
		mission: 'Ready for deployment'
	},
	{
		id: 'CAM-301',
		identifier: 'CAM-301',
		name: 'Sentinel West',
		type: 'camera',
		status: 'operational',
		location: 'West treeline',
		health: 96,
		lastCheck: '2024-10-19',
		resolution: '4K HDR',
		fieldOfView: 140,
		lastService: '2024-09-14',
		connectivity: 'PoE fiber uplink'
	},
	{
		id: 'CAM-318',
		identifier: 'CAM-318',
		name: 'Guardian PTZ',
		type: 'camera',
		status: 'maintenance',
		location: 'Irrigation canal junction',
		health: 65,
		lastCheck: '2024-10-11',
		resolution: '1080p PTZ',
		fieldOfView: 180,
		lastService: '2024-06-24',
		connectivity: 'Solar / LTE fallback'
	}
] satisfies Equipment[];
