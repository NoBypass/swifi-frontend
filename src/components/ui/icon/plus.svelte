<script lang="ts">
    import {type Props, iconVariants} from "./index";
    import {cn} from "@util/shadcn";

    type $$Props = Props;

    let className: $$Props["class"] = undefined;
    export let variant: $$Props["variant"] = undefined;
    export let size: $$Props["size"] = undefined;

    $: className = cn(iconVariants({ variant, size, className }))
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={className}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
