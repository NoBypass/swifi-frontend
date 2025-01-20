<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "@util/shadcn.ts";

	type $$Props = LabelPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root
	class={cn(
		"flex items-center gap-1 text-sm text-neutral-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
		className
	)}
	{...$$restProps}
>
	<slot />
</LabelPrimitive.Root>
