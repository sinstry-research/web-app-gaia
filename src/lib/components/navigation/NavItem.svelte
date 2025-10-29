<script lang="ts">
	interface Props {
		href: string;
		label: string;
		active?: boolean;
		align?: 'default' | 'end';
		children?: import('svelte').Snippet;
	}

	const { href, label, active = false, align = 'default', children }: Props = $props();
</script>

<li
	class={`ui-nav-item md:w-12 md:mx-auto md:flex-none ${align === 'end' ? 'md:mt-auto' : ''}`}
	class:is-active={active}
>
	<a
		href={href}
		class="flex h-12 w-12 items-center justify-center rounded-full"
		aria-current={active ? 'page' : undefined}
		aria-label={label}
	>
		{#if children}
			{@render children()}
		{/if}
	</a>
	{#if active}
		<span class="sr-only">{label}</span>
	{/if}
</li>
