<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Events, type Props, buttonVariants } from "./index";
	import {navigate} from "astro:transitions/client";
	import { cn } from "@util/shadcn";

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export let noAnim: $$Props["noAnim"] = false;
	export let href: $$Props["href"] = undefined;
	export { className as class };

	function removeHover(classString: string) {
		return classString.replace(/\bhover:[^\s]+\b/g, '').trim();
	}

	$: className = cn(buttonVariants({ variant, size, className }))
</script>

<ButtonPrimitive.Root
	{builders}
	class={noAnim ? removeHover(className) : className}
	type="button"
	{...$$restProps}
	on:click
	on:click={() => href && navigate(href)}
	on:keydown>
	<slot />
</ButtonPrimitive.Root>
