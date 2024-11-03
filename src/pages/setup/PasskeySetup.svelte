<script lang="ts">
    import { navigate } from "astro:transitions/client";
    import Loader from "@components/dynamic/Loader.svelte";
    import {parseSignupCredential, parseSignupOptions, type PublicKeyCredentialWithTransports} from "@api/auth";
    import {type PRFExtension, supportsPRF} from "@util/encryption/util";
    import * as Alert from "@components/ui/alert";
    import {Button} from "@components/ui/button";
    import {Checkbox} from "@components/ui/checkbox";
    import Info from "@components/Info.svelte";
    import {Label} from "@components/ui/label";

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    let stayLogged = false;
    let error = '';
    let awaiting = false;

    async function register() {
        const response = await fetch(`${apiUrl}/auth/signup-options}`, {
            credentials: 'include'
        });
        const options = parseSignupOptions(await response.json());

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: options
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return null;
        if (!supportsPRF(credential.getClientExtensionResults() as PRFExtension)) {
            throw new Error("The authenticator you used does not yet support a required feature. Try using a different authenticator or use password-based authentication.");
        }

        const signupResponse = await fetch(`${apiUrl}/auth/signup?stayLogged=${stayLogged}`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parseSignupCredential(credential))
        });

        if (!signupResponse.ok) {
            // TODO improve error handling
            throw new Error(`${signupResponse.status}`);
        }
    }

    async function handleClick() {
        error = '';
        awaiting = true;
        try {
            await register();
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

<h1 class="text-xl font-bold">Welcome</h1>
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
<p class="w-3/4 text-neutral-600">To stay secure, we use passkeys for authentication. Let's set your passkey up!</p>
<div class="h-32 text-center flex flex-col gap-2">
    <div class="flex gap-2 items-center mb-6">
        <Checkbox id="stayLogged" bind:checked={stayLogged} />
        <Label for="stayLogged">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
    </div>
    <Button class="mt-4" on:click={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6 fill-neutral-100 stroke-neutral-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
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
