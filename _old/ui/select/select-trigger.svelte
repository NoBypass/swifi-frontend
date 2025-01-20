<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import CaretSort from "svelte-radix/CaretSort.svelte";
	import { cn } from "@util/shadcn.ts";

	type $$Props = SelectPrimitive.TriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class={cn(
		"h-8 outline-none ring-offset-0 ring-1 focus:ring-2 hover:ring-black ring-neutral-400 focus:ring-blue-500 animate-all duration-150 placeholder:text-muted-foreground data-[placeholder]:[&>span]:text-neutral-500 flex w-full items-center justify-between whitespace-nowrap rounded-md bg-transparent px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...$$restProps}
>
	<slot />
	<div>
		<CaretSort class="h-4 w-4 opacity-50" />
	</div>
</SelectPrimitive.Trigger>
