<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "@util/shadcn";

	type $$Props = SelectPrimitive.LabelProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Label class={cn("px-2 pt-1.5 text-xs text-neutral-500 font-semibold", className)} {...$$restProps}>
	<slot />
</SelectPrimitive.Label>
