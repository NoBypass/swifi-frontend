<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import Circle from "lucide-svelte/icons/circle";
	import { cn } from "@util/shadcn.js";
	import Check from 'svelte-radix/Check.svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> & {
		value: string;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	class={cn(
		"border-white text-white focus-visible:ring-white aspect-square size-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="flex items-center justify-center">
			{#if checked}
				<Check class="fill-primary size-4" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
