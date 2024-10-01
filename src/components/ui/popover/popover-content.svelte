<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "@util/shadcn.ts";

	type $$Props = PopoverPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export let transition: $$Props["transition"] = flyAndScale;
	export let transitionConfig: $$Props["transitionConfig"] = undefined;
	export let align: $$Props["align"] = "center";
	export let sideOffset: $$Props["sideOffset"] = 4;
	export { className as class };
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	{align}
	{sideOffset}
	{...$$restProps}
	class={cn(
		"bg-white z-50 w-72 rounded-md border border-neutral-300 p-4 shadow-md outline-none",
		className
	)}
>
	<slot />
</PopoverPrimitive.Content>
