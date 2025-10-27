type Primitive = string | number | boolean | null | undefined;

type Join<K extends string, P extends string> = P extends ''
	? K
	: `${K}.${P}`;

export type NestedKeyOf<T> = {
	[K in keyof T & string]: T[K] extends Primitive
		? K
		: T[K] extends Array<any>
			? K
			: K | Join<K, NestedKeyOf<T[K]>>;
}[keyof T & string];
