<script lang="ts">
    import {decrypt, readEncryptionKey} from "@util/encryption/keys.ts";
    import {getBankAccounts} from "@api/bankAccount.ts";
    import {onMount} from "svelte";

    let accounts = $state([]);

    onMount(async () => {
        const encryptionKey = await readEncryptionKey();
        let response = await getBankAccounts()
        accounts = await Promise.all(response.map(async (account) => {
            account.name = await decrypt(encryptionKey, account.name);
            account.balance = await decrypt(encryptionKey, account.balance);
            return account;
        }))
    });
</script>

{#each accounts as account}
    <div class="border border-neutral-300 bg-neutral-50 p-4 rounded-2xl h-24 w-64">
        <h2 class="font-bold text-xl">{account.name}</h2>
        <p>{account.balance} {account.currency.iso_code}</p>
    </div>
{/each}
