<script lang="ts">
    import * as Alert from "@components/ui/alert";
    import type {PreinitializedWritableAtom} from "nanostores";

    interface Props {
        store?: PreinitializedWritableAtom<string> | undefined;
        error?: string | undefined;
    }

    let { store = undefined, error = undefined }: Props = $props();

    let data = $derived($store || error || "");
</script>

{#if data !== ""}
    <Alert.Root variant="error">
        <Alert.Title class="font-bold flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stroke-rose-600 size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            An Error Occurred
        </Alert.Title>
        <Alert.Description class="leading-tight">{data}</Alert.Description>
    </Alert.Root>
{/if}
