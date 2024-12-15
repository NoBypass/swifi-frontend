import Root from "./input.svelte";
import { type VariantProps, tv } from "tailwind-variants";

export const inputVariants = tv({
	base: "ring-offset-0 cursor-text flex border px-2 ring-1 has-[:focus]:ring-2 hover:ring-black rounded-lg transition-all duration-150 relative",
	variants: {
		variant: {
			default: 'ring-neutral-400 has-[:focus]:ring-blue-500',
			success: 'ring-emerald-400 has-[:focus]:ring-emerald-500',
			error: 'ring-rose-400 has-[:focus]:ring-rose-500',
			warn: 'ring-amber-400 has-[:focus]:ring-amber-500'
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export type Variant = VariantProps<typeof inputVariants>["variant"];

export type FormInputEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLInputElement;
};

export type InputEvents = {
	blur: FormInputEvent<FocusEvent>;
	change: FormInputEvent<Event>;
	click: FormInputEvent<MouseEvent>;
	focus: FormInputEvent<FocusEvent>;
	focusin: FormInputEvent<FocusEvent>;
	focusout: FormInputEvent<FocusEvent>;
	keydown: FormInputEvent<KeyboardEvent>;
	keypress: FormInputEvent<KeyboardEvent>;
	keyup: FormInputEvent<KeyboardEvent>;
	mouseover: FormInputEvent<MouseEvent>;
	mouseenter: FormInputEvent<MouseEvent>;
	mouseleave: FormInputEvent<MouseEvent>;
	mousemove: FormInputEvent<MouseEvent>;
	paste: FormInputEvent<ClipboardEvent>;
	input: FormInputEvent<InputEvent>;
	wheel: FormInputEvent<WheelEvent>;
};

export {
	Root,
	//
	Root as Input,
};
