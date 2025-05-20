<script lang="ts">
    import { type Props, iconVariants } from './index.ts';
    import {cn} from "@util/shadcn.ts";
    import type { WithElementRef } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';

    let {
        ref = $bindable(null),
        class: className,
        variant = undefined,
        size = undefined,
        children,
        ...restProps
    }: WithElementRef<HTMLAttributes<SVGElement>> & Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
     class={cn(iconVariants({ variant, size }), className)} {...restProps}>
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

