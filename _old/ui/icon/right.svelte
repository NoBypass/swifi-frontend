<script lang="ts">
    import {type Props, iconVariants} from "./index.ts";
    import {cn} from "@util/shadcn.ts";

    type $$Props = Props;

    let className: $$Props["class"] = undefined;
    export let variant: $$Props["variant"] = undefined;
    export let size: $$Props["size"] = undefined;

    $: className = cn(iconVariants({ variant, size, className }))
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={className}>
    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
