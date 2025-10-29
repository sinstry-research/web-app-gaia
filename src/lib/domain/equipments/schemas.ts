import { z } from 'zod';

export const equipmentTypeSchema = z.enum(['drone', 'camera']);
export const equipmentStatusSchema = z.enum(['operational', 'standby', 'maintenance']);

export const equipmentFormSchema = z
	.object({
		type: equipmentTypeSchema,
		name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
		identifier: z
			.string()
			.min(1, 'Identifier is required')
			.max(50, 'Identifier must be less than 50 characters')
			.regex(/^[A-Z0-9-]+$/, 'Identifier must contain only uppercase letters, numbers, and hyphens'),
		location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
		status: equipmentStatusSchema,
		battery: z.number().int().min(0).max(100),
		altitude: z.number().int().min(0).max(10000),
		speed: z.number().int().min(0).max(200),
		resolution: z.string().max(50),
		fieldOfView: z.number().int().min(20).max(360),
		lastService: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
		connectivity: z.string().max(50),
		mission: z.string().max(200)
	})
	.refine(
		(data) => {
			if (data.type === 'drone') {
				return data.battery >= 0 && data.battery <= 100 && data.altitude >= 0 && data.speed >= 0;
			}
			return true;
		},
		{
			message: 'Drone-specific fields are invalid'
		}
	)
	.refine(
		(data) => {
			if (data.type === 'camera') {
				return data.fieldOfView >= 20 && data.fieldOfView <= 360;
			}
			return true;
		},
		{
			message: 'Camera-specific fields are invalid'
		}
	);

export const equipmentSchema: z.ZodType<
	import('./types').Equipment,
	z.ZodTypeDef,
	unknown
> = z.discriminatedUnion('type', [
	z.object({
		id: z.string().min(1),
		identifier: z.string().min(1),
		name: z.string().min(1),
		type: z.literal('drone'),
		status: equipmentStatusSchema,
		location: z.string().min(1),
		health: z.number().int().min(0).max(100),
		lastCheck: z.string(),
		battery: z.number().int().min(0).max(100),
		altitude: z.number().int().min(0),
		speed: z.number().int().min(0),
		mission: z.string()
	}),
	z.object({
		id: z.string().min(1),
		identifier: z.string().min(1),
		name: z.string().min(1),
		type: z.literal('camera'),
		status: equipmentStatusSchema,
		location: z.string().min(1),
		health: z.number().int().min(0).max(100),
		lastCheck: z.string(),
		resolution: z.string(),
		fieldOfView: z.number().int().min(20),
		lastService: z.string(),
		connectivity: z.string()
	})
]);

export type EquipmentFormInput = z.input<typeof equipmentFormSchema>;
export type ValidatedEquipmentForm = z.output<typeof equipmentFormSchema>;

