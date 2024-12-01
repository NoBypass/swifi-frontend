<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "@util/shadcn.js";

	type $$Props = AvatarPrimitive.FallbackProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<AvatarPrimitive.Fallback
	class={cn("bg-muted flex h-full w-full items-center justify-center rounded-xl", className)}
	{...$$restProps}
>
	<slot />
</AvatarPrimitive.Fallback>
