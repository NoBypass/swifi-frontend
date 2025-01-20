import { type VariantProps, tv } from "tailwind-variants";

import Passkey from './passkey.svelte';
import Right from './right.svelte';
import Password from './password.svelte';
import Out from './out.svelte';
import Settings from './settings.svelte';
import Plus from './plus.svelte';
import Down from './down.svelte';

export const iconVariants = tv({
    base: "inline-block",
    variants: {
        variant: {
            light: "fill-white",
            dark: "fill-black",
            primary: "fill-indigo-500",
        },
        size: {
            sm: "size-5",
            md: "size-7",
            lg: "size-10",
        },
    },
    defaultVariants: {
        size: "md",
        variant: "light",
    },
});

export type Variant = VariantProps<typeof iconVariants>["variant"];
export type Size = VariantProps<typeof iconVariants>["size"];

export type Props = {
    variant?: Variant;
    size?: Size;
    "class"?: string;
};

export {
    Plus,
    Passkey,
    Right,
    Password,
    Out,
    Settings,
    Down,
};