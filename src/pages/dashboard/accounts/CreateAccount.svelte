<script lang="ts">
    import * as Dialog from "@components/ui/dialog";
    import * as Alert from "@components/ui/alert/index.js";
    import {cn} from "@util/shadcn";
    import {Button, buttonVariants} from "@components/ui/button";
    import Selector from "@components/Selector.svelte";
    import {moneyRegex} from "@util/strings";
    import {type Currency, getCurrencies} from "@api/currency";
    import {onMount} from "svelte";
    import {createBankAccounts} from "@api/bankAccount";
    import {Input} from "@components/ui/input";
    import {Label} from "@components/ui/label";

    let error = $state('');
    let accountName = $state('');
    let balance = $state('');
    let selectedCurrency = $state('');
    let currencies: Currency[] = $state([]);
    let open = $state(false);

    onMount(async () => {
        currencies = await getCurrencies();
    });

    async function handleSubmit(event: Event) {
        event.preventDefault();
        error = "";
        const response = await createBankAccounts([{
            name: accountName.trim(),
            balance: Number(balance),
            currency: selectedCurrency,
        }])
        if (!response.ok) {
            error = (await response.json()).message;
        } else {
            open = false;
            accountName = '';
            balance = '';
            selectedCurrency = '';
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger class={cn(buttonVariants({ variant: 'ghost', className: 'border border-neutral-300 border-dashed rounded-2xl h-24 w-64 grid place-content-center text-neutral-500 pl-1.5' }))}>
        <div class="flex gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new Account
        </div>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Add a bank account</Dialog.Title>
            <Dialog.Description>
                Add a bank account here. You can add a balance to view more statistics. Anything you enter here will be encrypted and stored securely.
            </Dialog.Description>
        </Dialog.Header>

        {#if error}
            <Alert.Root class="w-full" variant="error">
                <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
        {/if}

        <form onsubmit={handleSubmit} class="flex flex-col gap-4 items-center">
            <div class="flex flex-col gap-1 w-full">
                <Label for="name">Account Name or IBAN</Label>
                <Input id="name" bind:value={accountName} placeholder="e.g. Savings" class="w-full" />
            </div>
            <div class="w-full grid grid-cols-[1fr_auto] gap-3 items-end">
                <div class="flex flex-col gap-1">
                    <Label for="balance">Current Balance</Label>
                    <Input id="balance" censorFn={moneyRegex} bind:value={balance} label="Current Balance" placeholder="(optional)" class="w-full" />
                </div>
                <Selector bind:value={selectedCurrency} placeholder="Search for Currency..." heading="Currencies" data={currencies} />
            </div>
            <Button type="submit" class="flex gap-2 justify-center place-self-end px-8 mt-3" disabled={accountName === "" || (selectedCurrency === "" && balance !== "")}>
                Add Account
            </Button>
        </form>
    </Dialog.Content>
</Dialog.Root>