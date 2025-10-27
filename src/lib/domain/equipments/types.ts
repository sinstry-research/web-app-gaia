export type EquipmentType = 'drone' | 'camera';
export type EquipmentStatus = 'operational' | 'standby' | 'maintenance';
export type FilterKey = 'all' | EquipmentType;

export interface BaseEquipment {
	id: string;
	identifier: string;
	name: string;
	type: EquipmentType;
	status: EquipmentStatus;
	location: string;
	health: number;
	lastCheck: string;
}

export interface DroneEquipment extends BaseEquipment {
	type: 'drone';
	battery: number;
	altitude: number;
	speed: number;
	mission: string;
}

export interface CameraEquipment extends BaseEquipment {
	type: 'camera';
	resolution: string;
	fieldOfView: number;
	lastService: string;
	connectivity: string;
}

export type Equipment = DroneEquipment | CameraEquipment;

export interface EquipmentForm {
	type: EquipmentType;
	name: string;
	identifier: string;
	location: string;
	status: EquipmentStatus;
	battery: number;
	altitude: number;
	speed: number;
	resolution: string;
	fieldOfView: number;
	lastService: string;
	connectivity: string;
	mission: string;
}
