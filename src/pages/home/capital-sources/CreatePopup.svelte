<script lang="ts">
  import * as Dialog from "@components/ui/dialog/index.ts";
  import * as Select from '@components/ui/select';
  import { Button } from '@components/ui/button';
  import { Input } from '@components/ui/input';
  import { onMount } from 'svelte';
  import { getAllCurrencies } from '@api_v2/modules/currency.ts';
  import type { Currency } from '@model/currency.ts';
  import { addCapitalSource } from '@api_v2/modules/capitalSource.ts';

  let { children } = $props();

  let currencies: Currency[] = $state([]);
  let newCapitalSource = $state({
    name: '',
    initialBalance: '',
    currency: ''
  });
  let formValid = $derived(newCapitalSource.name.length > 0 && newCapitalSource.initialBalance.length > 0 && newCapitalSource.currency.length > 0);
  let open = $state(false);

  $effect(() => {
    newCapitalSource.initialBalance = newCapitalSource.initialBalance.replace(
      /^(\d+)?(\.\d{0,2})?.*$/,
      (_, intPart, decimalPart) => (intPart || "") + (decimalPart || "")
    );
  });

  onMount(async () => {
    currencies = await getAllCurrencies()
  });

  const onSubmit = async () => {
    if (!formValid) return;

    await addCapitalSource({
      ...newCapitalSource,
      initialBalance: parseFloat(newCapitalSource.initialBalance),
    })

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
        <Input bind:value={newCapitalSource.name} insetLabel="Name" />

        <div class="flex gap-2">
          <Input bind:value={newCapitalSource.initialBalance} class="grow" insetLabel="Current Balance" />
          <Select.Root type="single" bind:value={newCapitalSource.currency}>
            <Select.Trigger class="w-32 h-12">
              {currencies.find(currency => currency.isoCode === newCapitalSource.currency)?.isoCode || 'Currency'}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Currencies</Select.GroupHeading>
                {#each currencies as currency}
                  <Select.Item value={currency.isoCode}>{currency.isoCode}</Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </form>

      <Dialog.Footer>
        <Button onclick={onSubmit} disabled={!formValid} variant="primary" type="submit">Register</Button>
      </Dialog.Footer>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>