import { type VariantProps, tv } from "tailwind-variants";

export { default as Badge } from "./badge.svelte";
export const badgeVariants = tv({
	base: "inline-flex select-none items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
	variants: {
		variant: {
			default:
				"bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow",
			secondary:
				"bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow",
			outline: "text-foreground border-indigo-300 bg-indigo-50",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type Variant = VariantProps<typeof badgeVariants>["variant"];
