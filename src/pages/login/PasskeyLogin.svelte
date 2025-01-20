<script lang="ts">
    import { navigate } from "astro:transitions/client";
    import {Checkbox} from "@components/ui/checkbox";
    import {Label} from "@components/ui/label";
    import Info from "@components/Info.svelte";
    import {
        authenticate,
        getAuthenticationOptions, type Passkey,
        type PublicKeyCredentialWithAssertion, type User
    } from "@api/auth";
    import {Button} from "@components/ui/button";
    import * as Alert from "@components/ui/alert";
    import * as Icon from "@components/ui/icon";
    import Loader from "@components/dynamic/Loader.svelte";
    import {decryptAESKey, deriveKey, saveKey} from "@util/encryption/keys.ts";
    import {base64ToBinary, type PRFExtension, type PRFExtensionWithResults} from "@util/encryption/util.ts";
    import {createEncryptionIvPair} from "@util/encryption/iv.ts";

    let error = $state('');
    let stayLogged = $state(false);
    let awaiting = $state(false);

    async function login() {
        awaiting = true;
        const opts = await getAuthenticationOptions("key");

        const assertion: PublicKeyCredentialWithAssertion | null = await navigator.credentials.get({
            publicKey: opts
        }) as PublicKeyCredentialWithAssertion;
        if (!assertion) return;

        const authenticationResponse = await authenticate(assertion, stayLogged);
        if (!authenticationResponse.ok) {
            throw new Error(`${authenticationResponse.status}`);
        }

        const user: User = await authenticationResponse.json();
        if (user.setupStep !== -1) {
            await navigate(`/signup/step${user.setupStep}`);
        } else {
            const prfResults: PRFExtension = assertion.getClientExtensionResults() as PRFExtension;
            const derivedKey = await deriveKey((prfResults as PRFExtensionWithResults).prf.results.first, new TextEncoder().encode(""));
            let userKey: Passkey | undefined = user.passkeys.find(k => k.id === btoa(assertion.id))
            if (!userKey?.encryptionKey) {
                throw new Error("Couldn't find passkey for user. Please try again.");
            }

            console.log(userKey.encryptionKey);
            const { buffer } = await decryptAESKey(derivedKey, createEncryptionIvPair(base64ToBinary(userKey.encryptionKey.encryptedKey), base64ToBinary(userKey.encryptionKey.iv)));
            saveKey(buffer)

            await navigate(`/dashboard/overview`);
        }
    }

    async function handleClick() {
        error = '';
        try {
            await login();
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

{#if error}
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
<div class="flex gap-2 my-4 items-center">
    <Checkbox id="stayLogged" bind:checked={stayLogged} />
    <Label for="stayLogged" class="flex items-center">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
</div>
<div class="flex flex-col gap-2 w-64 mb-4">
    <p class="col-span-2">Log in with</p>
    <Button onclick={handleClick}>
        <Icon.Passkey variant="dark" />
        <p class="text-sm">Passkey</p>
        {#if awaiting}
            <Loader borderB="border-b-black" class="justify-self-end"/>
        {/if}
    </Button>
    <Button onclick={() => navigate(`/login/password?stayLogged=${stayLogged}`)} >
        <Icon.Password size="sm" variant="dark" />
        <p class="text-sm">Password</p>
    </Button>
</div>
