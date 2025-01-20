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
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
