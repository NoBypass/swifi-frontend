<script lang="ts">
	import { cn, type WithElementRef } from "@util/shadcn.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { navigate } from 'astro:transitions/client';

	let {
		ref = $bindable(null),
		href = undefined,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	onclick={() => { if (href) navigate(href) }}
	bind:this={ref}
	data-slot="table-row"
	class={cn(
		"duration-150 data-[state=selected]:bg-muted border-b transition-colors",
		`${href ? 'cursor-pointer hover:bg-neutral-100' : ''}`,
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>
