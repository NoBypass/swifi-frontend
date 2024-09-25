<script lang="ts">
    import Button from "../Button.svelte";
    import {onMount} from "svelte";
    import {takeErrPrefix, title} from "../../../util/strings";
    import type {PublicKeyCredentialWithTransports} from "../../../util/types";
    import { navigate } from "astro:transitions/client";

    let name = '';
    let error = '';

    onMount(() => {
        const queryParams = new URLSearchParams(window.location.search);
        name = queryParams.get('name') || '';
    });

    function base64urlToBase64(base64url: string) {
        return base64url.replace(/-/g, '+').replace(/_/g, '/');
    }

    function addBase64Padding(base64: string) {
        const pad = base64.length % 4;
        if (pad === 2) {
            return base64 + '==';
        } else if (pad === 3) {
            return base64 + '=';
        }
        return base64;
    }

    function fixBase64url(base64url: string) {
        return addBase64Padding(base64urlToBase64(base64url));
    }

    function base64ToBase64url(base64: string) {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    async function register() {
        const response = await fetch(`http://localhost:8080/auth/signup-options?name=${name.replace(" ", "+")}`);
        const resp = await response.json();

        const options = resp.data;
        options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
        options.user.id = Uint8Array.from(atob(fixBase64url(options.user.id)), c => c.charCodeAt(0));

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: options
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return

        const rawIdBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        const clientDataJSONBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)));
        const attestationObjectBase64Url = btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject)));

        const signupResponse = await fetch(`http://localhost:8080/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id : resp.id,
                data: {
                    id: credential.id,
                    rawId: base64ToBase64url(rawIdBase64Url),
                    type: credential.type,
                    response: {
                        clientDataJSON: base64ToBase64url(clientDataJSONBase64Url),
                        attestationObject: base64ToBase64url(attestationObjectBase64Url)
                    },
                },
            })
        });

        if (!signupResponse.ok) {
            throw new Error(`HTTP error! status: ${signupResponse.status}`);
        }
    }

    async function handleClick() {
        error = '';
        try {
            await register();
            navigate('/setup/step3');
        } catch (e) {
            console.error(e);
            error = 'An error occurred. Please try again. ' + e
        }
    }
</script>

<h1 class="text-2xl">Welcome, {title(name)}</h1>
<p>To stay secure, we use passkeys for authentication. Let's set your passkey up!</p>
<div class="h-32">
    <Button class="w-36 self-center" on:click={handleClick}>Set up</Button>
    {#if error !== ''}
        <p class="text-sm text-rose-500 mt-2">{error}</p>
    {/if}
</div>
