import type { Button as ButtonPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
	base: "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 transition-all duration-150",
	variants: {
		variant: {
			default: "hover:bg-indigo-600 bg-indigo-500 text-white",
			secondary: "hover:bg-neutral-300 bg-neutral-200 text-neutral-800 border border-neutral-300",
			transparent: "hover:bg-neutral-100 bg-transparent p-1",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
			outline:
				"border border-neutral-400 hover:bg-neutral-100",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-8 px-4 py-2",
			sm: "h-7 px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9",
			iconSm: "h-7 w-7",
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
