<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import CaretSort from "svelte-radix/CaretSort.svelte";
	import { cn } from "@util/shadcn";

	type $$Props = SelectPrimitive.TriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class={cn(
		"h-8 animate-all duration-150 border border-neutral-400 focus:outline focus:outline-offset-2 outline-indigo-300 focus:border-indigo-500 outline-1 placeholder:text-muted-foreground data-[placeholder]:[&>span]:text-neutral-500 flex w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...$$restProps}
>
	<slot />
	<div>
		<CaretSort class="h-4 w-4 opacity-50" />
	</div>
</SelectPrimitive.Trigger>
