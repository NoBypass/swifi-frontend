import Root from "./input.svelte";
import { type VariantProps, tv } from "tailwind-variants";

export const inputVariants = tv({
	base: "cursor-text outline-offset-0 flex border px-2 outline outline-1 has-[:focus]:outline-2 hover:outline-black rounded-lg transition-all duration-150 relative",
	variants: {
		variant: {
			default: 'outline-neutral-400 has-[:focus]:outline-blue-500',
			success: 'outline-emerald-400 has-[:focus]:outline-emerald-500',
			error: 'outline-rose-400 has-[:focus]:outline-rose-500',
			warn: 'outline-amber-400 has-[:focus]:outline-amber-500'
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
