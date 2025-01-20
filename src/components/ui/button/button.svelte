<script lang="ts" module>
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 transition-all duration-150",
		variants: {
			variant: {
				default: "hover:bg-neutral-300 bg-neutral-200 text-black",
				primary: "hover:bg-blue-600 bg-blue-500 text-white",
				secondary: "hover:bg-neutral-300 bg-neutral-200 text-neutral-800 border border-neutral-300",
				transparent: "hover:bg-neutral-200 bg-transparent p-1",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
				outline: "ring-offset-0 ring-1 ring-neutral-400 hover:bg-neutral-100 hover:ring-black focus:ring-2 focus:ring-blue-500 outline-none",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary decoration-2 underline-offset-2 hover:underline-offset-4 decoration-transparent underline hover:decoration-black",
			},
			size: {
				default: "h-8 px-4 py-2",
				sm: "h-7 px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-8 w-8",
				iconSm: "h-7 w-7",
				noPadding: "h-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	import { cn } from "@util/shadcn.js";

	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
