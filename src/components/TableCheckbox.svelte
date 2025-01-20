<script lang="ts">
    import type { Writable } from "svelte/store";
    import {Checkbox} from "@components/ui/checkbox";

    interface Props {
        checked: boolean;
    }

    let { checked = false, ...rest }: Props = $props();
</script>

<Checkbox bind:checked={checked} {...rest} />