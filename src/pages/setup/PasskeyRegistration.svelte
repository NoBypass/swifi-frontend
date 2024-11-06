<script lang="ts">
    import { navigate } from "astro:transitions/client";
    import Loader from "@components/dynamic/Loader.svelte";
    import {
        getRegistrationOptions,
        parseSignupCredential,
        type PublicKeyCredentialWithTransports
    } from "@api/auth";
    import {type PRFExtension, supportsPRF} from "@util/encryption/util";
    import * as Alert from "@components/ui/alert";
    import * as Icon from "@components/ui/icon";
    import {Button} from "@components/ui/button";

    let error = '';
    let awaiting = false;

    async function handleRegistration() {
        const opts = await getRegistrationOptions("key");

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: opts
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return null;
        if (!supportsPRF(credential.getClientExtensionResults() as PRFExtension)) {
            throw new Error("The authenticator you used does not yet support a required feature. Try using a different authenticator or use password-based authentication.");
        }

        localStorage.setItem("registrationCredential", JSON.stringify(parseSignupCredential(credential)));
    }

    async function handleClick() {
        error = '';
        awaiting = true;
        try {
            await handleRegistration();
            navigate(`/setup/step2`);
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
</script>

{#if error !== ''}
    <Alert.Root variant="error">
        <Alert.Title class="font-bold flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stroke-rose-600 size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            An error occurred
        </Alert.Title>
        <Alert.Description class="leading-tight">{error}</Alert.Description>
    </Alert.Root>
{/if}
<h1 class="text-xl font-bold">Welcome to Swifi</h1>
<p class="text-neutral-600 leading-tight">To stay secure, we use passkeys for authentication. Let's set your passkey up!</p>
<div class="h-32 text-center flex flex-col gap-2">
    <Button class="mt-4" on:click={handleClick}>
        <Icon.Passkey />
        <p class="w-16">Set up</p>
        {#if awaiting}
            <Loader borderB="border-b-white" class="justify-self-end"/>
        {/if}
    </Button>
    <Button class="self-start p-0 text-neutral-500 hover:decoration-neutral-500"
            href="/setup/password"
            size="sm"
            variant="link">
        Use Password instead (less secure)
    </Button>
</div>
