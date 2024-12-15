import type { Button as ButtonPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
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

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	noAnim?: boolean;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
