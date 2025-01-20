<script lang="ts">
    import {Button} from "@components/ui/button";
    import {Label} from "@components/ui/label";
    import {Input} from "@components/ui/input";
    import * as Dialog from "@components/ui/dialog";
    import * as Alert from "@components/ui/alert/index.js";
    import * as Icon from '@components/ui/icon';
    import * as RadioGroup from '@components/ui/radio-group';
    import {createLabel} from "@api/label.ts";
    import { labelCreateEvent } from './labelEvents.ts';

    let open = $state(false);
    let error = $state('');
    let selectedColor = $state('neutral');
    let name = $state('')

    async function handleSubmit(event: Event) {
        event.preventDefault();
        error = "";

        const response = await createLabel(name, selectedColor);

        if (!response.ok) {
            error = (await response.json()).message || 'An error occurred. Please try again.';
        } else {
            labelCreateEvent.emit({
                id: (await response.json()).id,
                name: name,
                color: selectedColor
            });
            open = false;
            name = '';
            selectedColor = 'neutral';
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button variant="transparent" size="iconSm">
            <Icon.Plus />
        </Button>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Create Label</Dialog.Title>
            <Dialog.Description>
                Create a label here. Labels can be used to categorize your transactions and view statistics.
            </Dialog.Description>
        </Dialog.Header>

        {#if error}
            <Alert.Root class="w-full" variant="error">
                <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
        {/if}

        <form onsubmit={handleSubmit} class="flex flex-col gap-4 items-center w-full">
            <div class="flex flex-col gap-1 w-full">
                <Label for="name">Label Name</Label>
                <Input id="name" type="text" placeholder="Enter label name" bind:value={name} required />
            </div>

            <div>
                <p>Select a color</p>
                <RadioGroup.Root bind:value={selectedColor} class="flex gap-2 *:w-9 *:h-9 *:rounded-lg *:text-white *:stroke-1 *:stroke-white">
                    <RadioGroup.Item checkSize="size-5" value="neutral" class="bg-neutral-400 border-neutral-600" />
                    <RadioGroup.Item checkSize="size-5" value="amber" class="bg-amber-400 border-amber-600" />
                    <RadioGroup.Item checkSize="size-5" value="red" class="bg-red-400 border-red-600" />
                    <RadioGroup.Item checkSize="size-5" value="rose" class="bg-rose-400 border-rose-600" />
                    <RadioGroup.Item checkSize="size-5" value="emerald" class="bg-emerald-400 border-emerald-600" />
                    <RadioGroup.Item checkSize="size-5" value="teal" class="bg-teal-400 border-teal-600" />
                    <RadioGroup.Item checkSize="size-5" value="blue" class="bg-blue-400 border-blue-600" />
                    <RadioGroup.Item checkSize="size-5" value="indigo" class="bg-indigo-400 border-indigo-600" />
                    <RadioGroup.Item checkSize="size-5" value="purple" class="bg-purple-400 border-purple-600" />
                </RadioGroup.Root>
            </div>

            <Button type="submit" variant="primary" disabled={name.length < 1}>Create Label</Button>
        </form>
    </Dialog.Content>
</Dialog.Root>
