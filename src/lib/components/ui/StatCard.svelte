<script lang="ts">
	import type { ComponentType } from 'svelte';

	type Orientation = 'horizontal' | 'vertical';
	type Tone = 'neutral' | 'positive' | 'negative';

	export let title: string;
	export let icon: ComponentType | undefined = undefined;
	export let iconSrc: string | undefined = undefined;
	export let color: string = 'slate';
	export let value: string | number | undefined = undefined;
	export let cardClass: string = '';
	export let orientation: Orientation = 'horizontal';
	export let description: string | undefined = undefined;
	export let change: string | undefined = undefined;
	export let changeTone: Tone = 'neutral';
	export let iconSize = 24;

	const toneClasses: Record<Tone, string> = {
		positive: 'text-emerald-600',
		negative: 'text-rose-600',
		neutral: 'ui-text-muted'
	};

	const backgroundColors: Record<string, string> = {
		yellow: '#eab308',
		blue: '#3b82f6',
		red: '#ef4444',
		orange: '#f97316',
		slate: '#1f2937',
		emerald: '#059669',
		indigo: 'var(--ui-accent)',
		sky: '#0ea5e9'
	};

	$: isSunMoonIcon = iconSrc && (iconSrc.includes('sun.svg') || iconSrc.includes('moon.svg'));
	$: backgroundColor = isSunMoonIcon ? 'transparent' : backgroundColors[color] ?? backgroundColors.slate;
	$: layoutClasses = orientation === 'vertical' ? 'flex flex-col gap-4' : 'flex items-center gap-4';
	$: iconWrapperClasses =
		orientation === 'vertical'
			? 'flex h-10 w-10 items-center justify-center rounded-full'
			: 'flex h-12 w-12 items-center justify-center rounded-full';
	$: iconImageClasses = orientation === 'vertical' ? 'h-10 w-10 object-contain' : 'h-12 w-12 object-contain';
	$: contentClasses = orientation === 'vertical' ? 'space-y-2' : 'flex-1 space-y-2';
	$: hasValue = value !== undefined && value !== null && value !== '';
</script>

<div class={`ui-card h-full p-6 ${layoutClasses} ${cardClass}`}>
	{#if icon || iconSrc}
		<div class={`text-white ${iconWrapperClasses}`} style={`background-color: ${backgroundColor}`}>
			{#if icon}
				<svelte:component this={icon} size={iconSize} />
			{:else if iconSrc}
				<img src={iconSrc} alt="" class={iconImageClasses} />
			{/if}
		</div>
	{/if}
	<div class={contentClasses}>
		<p class="text-sm font-medium ui-text-tertiary">{title}</p>
		{#if hasValue}
			<p class="text-3xl font-semibold ui-text-primary">{value}</p>
		{/if}
		{#if description}
			<p class="text-sm ui-text-subtle">{description}</p>
		{/if}
		{#if change}
			<p class={`text-sm font-medium ${toneClasses[changeTone]}`}>{change}</p>
		{/if}
	</div>
</div>
