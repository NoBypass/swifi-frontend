<script lang="ts">
    import Button from "../Button.svelte";
    import {onMount} from "svelte";
    import {base64ToBase64url, fixBase64url, title} from "../../../util/strings";
    import type {PublicKeyCredentialWithTransports} from "../../../util/types";
    import { navigate } from "astro:transitions/client";

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    let name = '';
    let email = '';
    let error = '';

    onMount(() => {
        const queryParams = new URLSearchParams(window.location.search);
        name = queryParams.get('name') || '';
        email = queryParams.get('email') || '';
    });

    async function register() {
        const response = await fetch(`${apiUrl}/auth/signup-options?name=${name.replace(" ", "+")}&email=${email}`, {
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

        const signupResponse = await fetch(`${apiUrl}/auth/signup`, {
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
            navigate(`/signup/step3?email=${email}`);
        } catch (e) {
            error = 'An error occurred. Please try again. ' + e
        }
    }
</script>

<h1 class="text-2xl">Welcome, {title(name)}</h1>
<p>To stay secure, we use passkeys for authentication. Let's set your passkey up!</p>
<div class="h-32 text-center flex flex-col gap-2">
    <Button class="w-36 self-center grid grid-cols-3 px-2.5" on:click={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6 fill-white stroke-indigo-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
        <p class="w-16 place-self-center">Set up</p>
    </Button>
    {#if error !== ''}
        <p class="text-sm text-rose-500">{error}</p>
    {/if}
</div>
