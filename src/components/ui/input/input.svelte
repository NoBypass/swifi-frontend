<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { tv, type VariantProps } from 'tailwind-variants';
	import type {Snippet} from "svelte";

	export const inputVariants = tv({
		base: "border-none z-0 py-0.5 ring-offset-0 cursor-text flex border ring-1 [&:has(:focus)]:ring-2 hover:ring-black rounded-lg transition-all duration-150 relative",
		variants: {
			variant: {
				default: 'ring-neutral-400 [&:has(:focus)]:ring-blue-500',
				success: 'ring-emerald-400 [&:has(:focus)]:ring-emerald-500',
				error: 'ring-rose-400 [&:has(:focus)]:ring-rose-500',
				warn: 'ring-amber-400 [&:has(:focus)]:ring-amber-500'
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	let {
		ref = $bindable(null),
		value = $bindable(),
		insetLabel = "",
		class: className,
		variant = "default",
		right = undefined,
		...restProps
	}: WithElementRef<HTMLInputAttributes, HTMLInputElement> & {
		variant?: VariantProps<typeof inputVariants>["variant"];
		insetLabel?: string;
		right?: Snippet;
	} = $props();

	let cd = $state(false)
	let valWidth = $state(0)
	let focused = $state(false)

	$effect(() => {
		if (value && ref) {
			valWidth = Math.min(textWidth(value), ref.clientWidth);
			cd = true;
			setTimeout(() => {
				cd = false;
			}, 1000);
		} else {
			valWidth = 0;
		}
	});

	const textWidth = (text: string) => {
		if (!ref) return 0;
		const ctx = document.createElement('canvas').getContext('2d')!;
		ctx.font = getComputedStyle(ref).font;
		if (ref.type === 'password') {
			const dotWidth = ctx.measureText('•').width;
			return text.length * dotWidth;
		}
		return ctx.measureText(text).width;
	}

	const updateCaretPosition = () => requestAnimationFrame(() => {
		if (!ref) return;
		const caretPos = ref.selectionStart || 0;
		const textUntilCaret = value === undefined ? "" : value.slice(0, caretPos);
		valWidth = Math.min(textWidth(textUntilCaret), ref.clientWidth);
	});

	let insetLabelName: string | undefined = $derived(insetLabel ? insetLabel.replace(/ /g, "-").toLowerCase() : undefined);
</script>

<div class={inputVariants({ variant, className: `${className}` })}>
	<span style="transform: translateY(18px) translateX({valWidth+4}px)"
		  class:hidden={!focused}
		  class:animate-blink={!cd}
		  class="z-10 absolute bg-black ml-1 w-px h-5 transition-all duration-50"></span>
	{#if insetLabel}
		<label for={insetLabelName}
			   class:text-xs={focused || value}
			   onfocus={() => ref?.focus()}
			   class={`ml-2 cursor-text absolute transition-all duration-150 z-10 ${focused || value ? "mt-0" : "mt-2"}`}>
			{insetLabel}
		</label>
	{/if}
	<input bind:this={ref}
		   id={insetLabelName}
		   class={`caret-transparent w-full outline-none px-2 bg-transparent ${insetLabel ? "pt-4" : ""}`}
		   bind:value
		   oninput={updateCaretPosition}
		   onkeydown={updateCaretPosition}
		   onmousedown={updateCaretPosition}
		   onfocus={() => focused = true}
		   onblur={() => focused = false}
		   {...restProps}
	/>
	{#if right}
		<div class="mt-4 mr-2">
			{@render right()}
		</div>
	{/if}
</div>
