<script lang="ts">
    import {Button} from "@components/ui/button";
    import Input from "@components/dynamic/Input.svelte";
    import Selector from "@components/Selector.svelte";
    import { navigate } from "astro:transitions/client";
    import {onMount} from "svelte";
    import {moneyRegex} from "@util/strings";
    import {type Currency, getCurrencies} from "@api/currency";
    import {encrypt, readEncryptionKey} from "@util/encryption/keys";
    import {createBankAccounts} from "@api/bankAccount";

    // TODO make it possible to provide currency but not balance and make error messages more descriptive

    let selectedCurrency = "";
    let accountName = "";
    let balance = "";
    let currencies: Currency[] = [];
    let error = "";
    let encryptionKey: CryptoKey | undefined = undefined;
    let accounts: {
        name: string;
        balance: string;
        currency: string;
    }[] = [];

    $: addButtonDisabled = accountName === "" || (selectedCurrency === "" && balance !== "");
    $: finishButtonDisabled = accounts.length === 0;

    onMount(async () => {
        currencies = await getCurrencies();
        accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

        encryptionKey = await readEncryptionKey();
    });

    async function addAccounts() {
        error = "";
        const encryptedAccounts = await Promise.all(accounts.map(async (a) => {
            return {
                name: await encrypt(encryptionKey!, a.name),
                balance: await encrypt(encryptionKey!, a.balance),
                currency: a.currency,
            };
        }));

        const response = await createBankAccounts(encryptedAccounts)

        if (!response.ok) {
            error = (await response.json()).message;
        } else {
            localStorage.removeItem("accounts");
            navigate("/dashboard/overview");
        }
    }

    function handleSubmit(event: Event) {
        event.preventDefault();
        accounts = [
            ...accounts,
            {
                name: accountName.trim(),
                balance: balance,
                currency: selectedCurrency,
            },
        ];
        localStorage.setItem("accounts", JSON.stringify(accounts));
        accountName = "";
        balance = "";
    }

    function removeAccount(accountName: string) {
        accounts = accounts.filter((account) => account.name !== accountName);
        localStorage.setItem("accounts", JSON.stringify(accounts));
    }

    function editAccount(an: string) {
        const account = accounts.find((account) => account.name === an);
        if (!account) return;
        accountName = account.name;
        balance = account.balance;
        selectedCurrency = account.currency;
        removeAccount(accountName);
    }
</script>

<section class="border-b border-neutral-300 pb-2 text-center">
    <h1 class="font-bold text-lg">Your Accounts</h1>
    <p class="text-neutral-600 leading-tight w-96">Enter at least one bank account here. You don't have to enter a balance but you will be able to view more statistics if you do. You can edit the accounts later.</p>
    {#each accounts as account}
        <div class="text-left flex justify-between border border-neutral-300 rounded-lg my-2 py-2 px-3">
            <div>
                <p class="font-bold">{account.name}</p>
                <p class="text-xs text-neutral-600">{account.balance} {account.currency}</p>
            </div>
            <div class="flex gap-4 h-10 items-center pr-2">
                <Button size="icon" variant="transparent" on:click={() => editAccount(account.name)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </Button>
                <Button size="icon" variant="transparent" on:click={() => removeAccount(account.name)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
            </div>
        </div>
    {/each}
</section>
<form on:submit={handleSubmit} class="flex flex-col gap-4 items-center py-4">
    <Input bind:value={accountName} label="Account Name or IBAN" placeholder="e.g. Savings" class="w-full" />
    <div class="w-full grid grid-cols-[1fr_auto] gap-3 items-end">
        <Input censorFn={moneyRegex} bind:value={balance} label="Current Balance" placeholder="(optional)" class="w-full" />
        <Selector bind:value={selectedCurrency} placeholder="Search for Currency..." heading="Currencies" data={currencies} />
    </div>
    <Button variant="secondary" class="w-full mt-2" type="submit" disabled={addButtonDisabled}>
        <div class="h-6 flex items-center -translate-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>
        Add Bank Account
    </Button>
    <br>
    <Button variant="primary" class="w-full flex gap-2 justify-center" disabled={finishButtonDisabled} on:click={addAccounts}>
        Finish
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
    </Button>
    <p class="text-red-500 text-sm">{error}</p>
</form>
