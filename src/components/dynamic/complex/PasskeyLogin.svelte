<script lang="ts">
    import Button from "../Button.svelte";
    import {base64ToBase64url, fixBase64url} from "@util/strings";
    import type {PublicKeyCredentialWithAssertion} from "@util/types";
    import { navigate } from "astro:transitions/client";
    import {Checkbox} from "@components/ui/checkbox";
    import {Label} from "@components/ui/label";
    import Info from "@components/dynamic/complex/Info.svelte";
    import {onMount} from "svelte";
    import {navigator} from "@util/navigator";

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    let error = '';
    let stayLogged = false;

    onMount(async () => {
        navigate(await navigator(apiUrl))
    });

    async function login() {
        const response = await fetch(`${apiUrl}/auth/login-options`, {
            credentials: "include",
        });
        const options = await response.json();

        options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));

        const assertion: PublicKeyCredentialWithAssertion | null = await navigator.credentials.get({
            publicKey: options
        }) as PublicKeyCredentialWithAssertion;
        if (!assertion) return;

        const loginResponse = await fetch(`${apiUrl}/auth/login?stayLogged=${stayLogged}`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: assertion.id,
                rawId: base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)))),
                type: assertion.type,
                response: {
                    clientDataJSON: base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON)))),
                    authenticatorData: base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData)))),
                    signature: base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature)))),
                    userHandle: assertion.response.userHandle ? base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(assertion.response.userHandle)))) : null
                }
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`${loginResponse.status}`);
        }

        const user = await loginResponse.json();
        if (user.setupStep !== -1) {
            navigate(`/signup/step${user.setupStep}`);
        }
    }

    async function handleClick() {
        error = '';
        try {
            await login();
        } catch (e) {
            error = e;
        }
    }
</script>

<div class="flex gap-2 items-center mb-6">
    <Checkbox id="stayLogged" bind:checked={stayLogged} />
    <Label for="stayLogged">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
</div>
<Button class="w-48 self-center grid grid-cols-3 px-2.5" on:click={handleClick} kind="secondary">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6 fill-neutral-100 stroke-neutral-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
    <p class="w-16 place-self-center">Login</p>
</Button>
{#if error !== ''}
    <p class="text-sm text-rose-500">{error}</p>
{/if}
