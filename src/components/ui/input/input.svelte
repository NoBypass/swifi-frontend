<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { tv, type VariantProps } from 'tailwind-variants';

	export const inputVariants = tv({
		base: "z-0 caret-transparent py-0.5 ring-offset-0 cursor-text flex border px-2 ring-1 focus:ring-2 hover:ring-black rounded-lg transition-all duration-150 relative outline-none",
		variants: {
			variant: {
				default: 'ring-neutral-400 focus:ring-blue-500',
				success: 'ring-emerald-400 focus:ring-emerald-500',
				error: 'ring-rose-400 focus:ring-rose-500',
				warn: 'ring-amber-400 focus:ring-amber-500'
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		variant = "default",
		...restProps
	}: WithElementRef<HTMLInputAttributes, HTMLInputElement> & {
		variant?: VariantProps<typeof inputVariants>["variant"];
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
</script>

<span	style="transform: translateY(22px) translateX({valWidth+5}px)"
	class:hidden={!focused}
	class:animate-blink={!cd}
	class="z-10 absolute bg-black ml-1 w-px h-5 transition-all duration-50"></span>
<input
	bind:this={ref}
	class={inputVariants({ variant, className })}
	bind:value
	oninput={updateCaretPosition}
	onkeydown={updateCaretPosition}
	onmousedown={updateCaretPosition}
	onfocus={() => focused = true}
	onblur={() => focused = false}
	style="--caret-position: {valWidth + 5}px;"
	{...restProps}
/>