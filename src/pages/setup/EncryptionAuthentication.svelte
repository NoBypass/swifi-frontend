<script lang="ts">
    import {
        authenticate,
        getAuthenticationOptions,
        type PublicKeyCredentialWithAssertion,
    } from "@api/auth";
    import {step2Error} from "./setupStore";
    import {deriveKey, encryptAESKey, generateAESKey, saveKey} from "@util/encryption/keys";
    import {type PRFExtension, type PRFExtensionWithResults} from "@util/encryption/util";
    import {Button} from "@components/ui/button";
    import { navigate } from 'astro:transitions/client';
    import {Checkbox} from "@components/ui/checkbox";
    import Info from "@components/Info.svelte";
    import {Label} from "@components/ui/label";
    import * as Icon from "@components/ui/icon";
    import Loader from "@components/dynamic/Loader.svelte";

    let stayLogged = $state(false);
    let loading = $state(false);

    async function handleRegistration() {
        const opts = await getAuthenticationOptions();

        const assertion: PublicKeyCredentialWithAssertion | null = await navigator.credentials.get({
            publicKey: opts
        }) as PublicKeyCredentialWithAssertion;
        if (!assertion) throw new Error('Error while getting encryption key configuration');

        const prfResults: PRFExtension = assertion.getClientExtensionResults() as PRFExtension;
        if (!prfResults || !("prf" in prfResults) || ("prf" in prfResults && "enabled" in prfResults.prf && !prfResults.prf.enabled)) {
            throw new Error("The authenticator you used does not yet support some required features. Try using a different authenticator or use password-based authentication.");
        }

        const derivedKey = await deriveKey((prfResults as PRFExtensionWithResults).prf.results.first, new TextEncoder().encode(""));
        const key = await generateAESKey()
        const { encryptedKey, iv } = await encryptAESKey(derivedKey, key)

        const response = await authenticate(assertion, stayLogged, encryptedKey, iv);

        if (!response.ok) {
            throw new Error("An error occurred while setting up encryption. Please try again.");
        }

        saveKey(key);
        await navigate("/setup/step3")
    }

    async function handleClick() {
        step2Error.set("");
        loading = true;
        try {
            await handleRegistration();
            step2Error.set("");
        } catch (e) {
            if (!(e instanceof Error)) {
                step2Error.set("An unknown error occurred. Please try again.");
            } else if (e.name === "NotAllowedError") {
                step2Error.set("The operation was aborted or timed out. Please try again.");
            } else {
                step2Error.set(e.message);
            }
        }
        loading = false;
    }
</script>

<div class="mt-2 flex flex-col items-center">
    <div class="w-full my-4 flex gap-2 justify-center items-center">
        <Checkbox id="stayLogged" bind:checked={stayLogged} />
        <Label for="stayLogged">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
    </div>
    <Button class="w-64 mb-6" on:click={handleClick}>
        <Icon.Passkey variant="dark" />
        Encrypt my Data
        {#if loading}
            <Loader borderB="border-b-black" class="justify-self-end"/>
        {/if}
    </Button>
    {#if $step2Error !== ""}
        <a class="text-sm" href="/setup/password">Use Password Instead</a>
    {/if}
</div>
