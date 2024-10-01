<script lang="ts">
    import Button from "../Button.svelte";
    import {onMount} from "svelte";
    import {base64ToBase64url, fixBase64url, title} from "../../../util/strings";
    import type {PublicKeyCredentialWithTransports} from "../../../util/types";
    import { navigate } from "astro:transitions/client";
    import Loader from "@components/dynamic/Loader.svelte";

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    let name = '';
    let stayLogged = false;
    let error = '';
    let awaiting = false;

    onMount(() => {
        const queryParams = new URLSearchParams(window.location.search);
        name = queryParams.get('name') || '';
        stayLogged = queryParams.get('stayLogged') === 'true';
    });

    async function register() {
        awaiting = true;
        const response = await fetch(`${apiUrl}/auth/signup-options?name=${name.replace(" ", "+")}`, {
            credentials: 'include'
        });
        const options = await response.json();

        options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
        options.user.id = Uint8Array.from(atob(fixBase64url(options.user.id)), c => c.charCodeAt(0));

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: options
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return

        const rawIdBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        const clientDataJSONBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)));
        const attestationObjectBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject)));

        const signupResponse = await fetch(`${apiUrl}/auth/signup?stayLogged=${stayLogged}`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: credential.id,
                rawId: base64ToBase64url(rawIdBase64Url),
                type: credential.type,
                response: {
                    clientDataJSON: base64ToBase64url(clientDataJSONBase64Url),
                    attestationObject: base64ToBase64url(attestationObjectBase64Url)
                },
            })
        });

        if (!signupResponse.ok) {
            throw new Error(`${signupResponse.status}`);
        }
    }

    async function handleClick() {
        error = '';
        try {
            await register();
            navigate(`/signup/step2`);
        } catch (e) {
            error = 'An error occurred. Please try again. ' + e
        }
        awaiting = false;
    }
</script>

<h1 class="text-xl font-bold">Welcome, <b class="inline text-indigo-600">{title(name)}</b></h1>
<p class="w-3/4 text-neutral-600">To stay secure, we use passkeys for authentication. Let's set your passkey up!</p>
<div class="h-32 text-center flex flex-col gap-2">
    <Button class="w-full mt-4 grid grid-cols-3" on:click={handleClick} kind="secondary">
        <div class="flex justify-self-center col-start-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6 fill-neutral-100 stroke-neutral-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
            <p class="w-16">Set up</p>
        </div>
        {#if awaiting}
            <Loader class="justify-self-end"/>
        {/if}
    </Button>
    {#if error !== ''}
        <p class="text-sm text-rose-500">{error}</p>
    {/if}
</div>
