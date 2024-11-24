<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { type Variant, inputVariants, type InputEvents } from "./index";
	import { cn } from "@util/shadcn";

	type $$Events = InputEvents;
	type $$Props = HTMLInputAttributes & {
		variant?: Variant;
		insetLabel?: string;
	};

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let insetLabel: $$Props["insetLabel"] = undefined;
	export let censorFn: (value: string) => string = (value) => value;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined;

	let cd = false
	let valWidth = 0
	let caretPos = 0
	let focused = false
	let inputElem: HTMLInputElement | null = null

	$: {
		if (value && inputElem) {
			value = censorFn(value);
			valWidth = Math.min(textWidth(value), inputElem.clientWidth);
			cd = true;
			setTimeout(() => {
				cd = false;
			}, 1000);
		} else {
			valWidth = 0;
		}
	}

	function updateCaretPosition() {
		requestAnimationFrame(() => {
			if (!inputElem) return;
			caretPos = inputElem.selectionStart || 0;
			const textUntilCaret = value === undefined ? "" : value.slice(0, caretPos);
			valWidth = Math.min(textWidth(textUntilCaret), inputElem.clientWidth);
		});
	}

	function textWidth(text: string) {
		if (!inputElem) return 0;
		const ctx = document.createElement('canvas').getContext('2d')!;
		ctx.font = getComputedStyle(inputElem).font;
		if (inputElem.type === 'password') {
			const dotWidth = ctx.measureText('•').width;
			return text.length * dotWidth;
		}
		return ctx.measureText(text).width;
	}

	function focusOnParentClick(node: HTMLInputElement) {
		const handleClick = () => node.focus()
		node.parentNode!.addEventListener('click', handleClick)
		return {destroy() {
			node.parentNode!.removeEventListener('click', handleClick)
		}}
	}

	$: insetLabelName = insetLabel ? insetLabel.replace(/ /g, "-").toLowerCase() : undefined;
</script>

<div class={inputVariants({ variant, className: `${insetLabel ? "pt-4" : ""}` })}>
	<span style="transform: translateY(4px) translateX({valWidth-3}px)"
		  class:hidden={!focused}
		  class:animate-blink={!cd}
		  class="absolute bg-black ml-1 w-px h-5 transition-all duration-50" />
	{#if insetLabel}
		<label for={insetLabelName}
			   class:-mt-3.5={focused || value}
			   class:text-xs={focused || value}
			   class="cursor-text absolute -mt-1.5 ml-0 transition-all duration-150">
			{insetLabel}
		</label>
	{/if}
	<input class={cn("placeholder:text-neutral-400 placeholder:text-sm py-0.5 caret-transparent w-full bg-transparent outline-none", className)}
		   id={insetLabelName}
		   use:focusOnParentClick
		   bind:value
		   bind:this={inputElem}
		   {readonly}
		   on:blur={() => focused = false}
		   on:focus={() => focused = true}
		   on:input={updateCaretPosition}
		   on:keydown={updateCaretPosition}
		   on:mousedown={updateCaretPosition}
		   on:blur
		   on:change
		   on:click
		   on:focus
		   on:focusin
		   on:focusout
		   on:keydown
		   on:keypress
		   on:keyup
		   on:mouseover
		   on:mouseenter
		   on:mouseleave
		   on:mousemove
		   on:paste
		   on:input
		   on:wheel|passive
		   {...$$restProps}
	/>
	<slot name="right" />
</div>
