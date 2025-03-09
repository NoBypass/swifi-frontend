<script lang="ts">
    import { navigate } from "astro:transitions/client";
    import Loader from "@components/dynamic/Loader.svelte";
    import {
        getRegistrationOptions,
        type PublicKeyCredentialWithTransports, register, validateEmail
    } from "@api/auth";
    import {type PRFExtension, supportsPRF} from "@util/encryption/util";
    import * as Alert from "@components/ui/alert";
    import * as Icon from "@components/ui/icon";
    import {Button} from "@components/ui/button";
    import {Input} from "@components/ui/input";
    import {onMount} from "svelte";

    let error = $state('');
    let awaiting = $state(false);
    let name = $state('');
    let submitted = $state(false);

    async function handleRegistration() {
        const opts = await getRegistrationOptions("key", name);

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: opts
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return null;
        if (!supportsPRF(credential.getClientExtensionResults() as PRFExtension)) {
            throw new Error("The authenticator you used does not yet support a required feature. Try using a different authenticator or use password-based authentication.");
        }

        const response = await register(credential, true);

        if (!response.ok) {
            throw new Error("An error occurred while registering your passkey. Please try again.");
        }
    }

    async function handleClick() {
        error = '';
        awaiting = true;
        try {
            await handleRegistration();
            await navigate(`/setup/step2`);
        } catch (e) {
            if (!(e instanceof Error)) {
                error = "An unknown error occurred. Please try again.";
            } else if (e.name === "NotAllowedError") {
                error = "The operation was aborted or timed out. Please try again.";
            } else {
                error = e.message;
            }
        }
        awaiting = false;
    }

    onMount(() => {
        if (localStorage.getItem("name")) {
            name = localStorage.getItem("name") || '';
        }
    });

    function handleSubmit(e: Event) {
        e.preventDefault();
        localStorage.setItem("name", name);
        navigate("/setup/step2");
    }
</script>

{#if error !== ''}
    <Alert.Root variant="error">
        <Alert.Title class="font-bold flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stroke-rose-600 size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            An error occurred
        </Alert.Title>
        <Alert.Description class="leading-tight text-left max-w-md">{error}</Alert.Description>
    </Alert.Root>
{/if}
<form class="text-center flex flex-col gap-2">
    <Input insetLabel="Name"
           bind:value={name}
           autocomplete="given-name"
           class="w-96"
           onkeydown={(e) => e.key === 'Enter' && handleSubmit(e)}>
        {#snippet right()}
            <Button size="icon" variant="transparent" class="-mt-3" onclick={handleSubmit} disabled={name.length===0}>
                <Icon.Right />
            </Button>
        {/snippet}
    </Input>
    {#if submitted}
        <div class="grid grid-cols-2 gap-2">
            <Button onclick={handleClick}>
                <Icon.Passkey variant="dark" />
                <p class="text-sm">Set up Passkey</p>
                {#if awaiting}
                    <Loader borderB="border-b-black" class="justify-self-end"/>
                {/if}
            </Button>
            <Button onclick={() => navigate("/setup/password")} >
                <Icon.Password size="sm" variant="dark" />
                <p class="text-sm">Set up Password (less secure)</p>
            </Button>
        </div>
    {/if}
</form>