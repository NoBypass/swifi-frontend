<script lang="ts">
    import * as Popover from "@components/ui/popover"
    import * as Command from "@components/ui/command"
    import { tick } from "svelte";
    import {Button} from "@components/ui/button";

    export let heading: string = "";
    export let placeholder: string = "";
    export let data: any[] = [];
    export let value = ""

    let open = false
    let selectedValue = ""

    $: {
        const name = data.find((f) => f.name === value)?.name ?? "Currency";
        selectedValue = name === "" ? "Currency" : name;
    }

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }
</script>

<Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
        <Button builders={[builder]}
                noAnim
                variant="outline"
                role="combobox"
                aria-expanded={open}
                class="flex-1 rounded-lg justify-between">
                {selectedValue}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5 translate-x-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
        </Button>
    </Popover.Trigger>
    <Popover.Content class="w-full p-0 w-48">
        <Command.Root>
            <Command.Input {placeholder} />
            <Command.List>
                <Command.Empty class="text-neutral-600">Currency not found.</Command.Empty>
                <Command.Group {heading}>
                    {#each data as dataPoint}
                        <Command.Item value={dataPoint.name}
                                      class="aria-selected:bg-neutral-100 cursor-pointer"
                                      onSelect={(currentValue) => {
                                          value = currentValue;
                                          closeAndFocusTrigger(ids.trigger)
                                      }}>
                            {dataPoint.name}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>