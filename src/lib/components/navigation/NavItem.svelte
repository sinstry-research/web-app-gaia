<script lang="ts">
	export let href: string;
	export let label: string;
	export let active = false;
	export let align: 'default' | 'end' = 'default';
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
		<slot />
	</a>
	{#if active}
		<span class="sr-only">{label}</span>
	{/if}
</li>
