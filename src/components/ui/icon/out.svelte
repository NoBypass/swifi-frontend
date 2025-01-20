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
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
</svg>
