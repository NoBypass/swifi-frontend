<script lang="ts">
  import * as Dialog from "@components/ui/dialog/index.ts";
  import { Button } from '@components/ui/button';
  import { Input } from '@components/ui/input';
  import { addLabel } from '@api_v2/modules/label.ts';
  import type { Label } from '@model/label.ts';

  let { children } = $props();

  let newLabel: Label = $state({
    name: '',
    color: '',
  });
  let formValid = $derived(newLabel.name.length > 0 && newLabel.color.length > 0);
  let open = $state(false);

  const onSubmit = async () => {
    if (!formValid) return;

    await addLabel(newLabel);
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Register a Capital Source</Dialog.Title>
      <Dialog.Description>
        You can register a capital source here.
      </Dialog.Description>

      <form class="my-4 flex flex-col gap-2">
        <Input bind:value={newLabel.name} insetLabel="Name" />
        <Input bind:value={newLabel.color} insetLabel="Color" />
      </form>

      <Dialog.Footer>
        <Button onclick={onSubmit} disabled={!formValid} variant="primary" type="submit">Create</Button>
      </Dialog.Footer>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>