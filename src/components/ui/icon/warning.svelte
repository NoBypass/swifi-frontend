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
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>
