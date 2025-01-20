<script lang="ts">
  import { Input } from '@components/ui/input';
  import { Label } from '@components/ui/label';
  import * as Select from '@components/ui/select';
  import { Button } from '@components/ui/button';
  import { decrypt, readEncryptionKey } from '@util/encryption/keys.ts';
  import type { BankAccount } from '@api/bankAccount.ts';
  import { onMount } from 'svelte';

  let encryptionKey: CryptoKey;

  let { data }: { data: BankAccount[] } = $props();
  let bankAccounts: BankAccount[] = $state([]);

  onMount(async () => {
    encryptionKey = await readEncryptionKey();
    bankAccounts = await decryptAccounts(data);
  });

  let transactionName: string = $state('');
  let selectedBankAccount: string | undefined = $state(undefined);

  $effect(() => {
    if ('localStorage' in window) {
      (async function() {
        bankAccounts = await decryptAccounts(data);
      })();
    }
  });

  const decryptAccounts = async (accounts: BankAccount[]): Promise<BankAccount[]> => {
    return await Promise.all(
      accounts.map(async (account) => {
        return {
          ...account,
          name: await decrypt(encryptionKey, account.name),
          balance: await decrypt(encryptionKey, account.balance),
        };
      })
    );
  };
</script>

<div class="flex flex-col gap-1">
  <Label for="tname">Transaction Name</Label>
  <Input
    id="tname"
    bind:value={transactionName}
    maxlength={512}
    class="w-96"
    placeholder="Enter a name"
  />
</div>

<Button size="icon" variant="outline">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 6h.008v.008H6V6Z"
    />
  </svg>
</Button>

<Button size="icon" variant="outline">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
</Button>

<Button size="icon" variant="outline">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  </svg>
</Button>

<Select.Root type="single" bind:value={selectedBankAccount}>
  <Select.Trigger class="w-48">
    {bankAccounts.find(account => account.id === selectedBankAccount)?.name || 'Select a bank account'}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Accounts</Select.GroupHeading>
      {#each bankAccounts as account}
        <Select.Item value={account.id}>{account.name}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
