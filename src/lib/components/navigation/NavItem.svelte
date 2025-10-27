<script lang="ts">
	export let href: string;
	export let label: string;
	export let active = false;
	export let align: 'default' | 'end' = 'default';
</script>

<li
	class={`ui-nav-item md:w-14 md:flex-none md:mx-2 ${align === 'end' ? 'md:mt-auto md:mb-2' : 'md:mt-2'}`}
	class:is-active={active}
>
	<a
		href={href}
		class="flex h-12 w-12 items-center justify-center"
		aria-current={active ? 'page' : undefined}
		aria-label={label}
	>
		<slot />
	</a>
	{#if active}
		<span class="sr-only">{label}</span>
	{/if}
</li>
