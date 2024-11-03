import Root from "./input.svelte";
import { type VariantProps, tv } from "tailwind-variants";

export const inputVariants = tv({
	base: "cursor-text flex border px-2 rounded-lg has-[:focus]:outline has-[:focus]:outline-offset-2 outline-offset-0 duration-150 outline-1 transition-all",
	variants: {
		variant: {
			default: 'border-neutral-400 has-[:focus]:border-indigo-500 outline-indigo-300',
			success: 'border-emerald-600 has-[:focus]:border-emerald-500 outline-emerald-300',
			error: 'border-rose-600 has-[:focus]:border-rose-500 outline-rose-300',
			warn: 'border-amber-600 has-[:focus]:border-amber-500 outline-amber-300'
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
