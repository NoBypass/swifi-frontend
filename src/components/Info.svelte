<script lang="ts">
    import {Button} from "@components/ui/button";
    import * as Tooltip from "@components/ui/tooltip";

    export let text: string;
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button builders={[builder]} variant="transparent" size="iconSm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 stroke-neutral-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content class="bg-white/20 text-black backdrop-blur-sm border border-neutral-300">
        <p>{text}</p>
    </Tooltip.Content>
</Tooltip.Root>
