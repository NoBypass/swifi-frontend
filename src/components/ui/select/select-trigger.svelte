<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { cn } from "@util/shadcn.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		"ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring transition-all duration-150 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm focus:outline-none ring-offset-0 ring-1 ring-neutral-400 hover:ring-black focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
