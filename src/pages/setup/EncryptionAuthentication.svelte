<script lang="ts">
    import {
        authenticate,
        getAuthenticationOptions,
        type PublicKeyCredentialWithAssertion,
    } from "@api/auth";
    import {encryptAESKey, generateAESKey} from "@util/encryption/key";
    import {type PRFExtension, type PRFExtensionWithResults} from "@util/encryption/util";
    import {Button} from "@components/ui/button";
    import { navigate } from 'astro:transitions/client';
    import {Checkbox} from "@components/ui/checkbox";
    import Info from "@components/Info.svelte";
    import {Label} from "@components/ui/label";
    import * as Icon from "@components/ui/icon";
    import Loader from "@components/dynamic/Loader.svelte";
    import { toast } from "svelte-sonner";

    let stayLogged = $state(false);
    let loading = $state(false);

    async function handleAuthentication() {
        const opts = await getAuthenticationOptions("webauthn");

        const assertion: PublicKeyCredentialWithAssertion | null = await navigator.credentials.get({
            publicKey: opts
        }) as PublicKeyCredentialWithAssertion;
        if (!assertion) throw new Error('Error while generating assertion. Please try again.');

        const prfResults: PRFExtension = assertion.getClientExtensionResults() as PRFExtension;
        if (!prfResults || !("prf" in prfResults) || ("prf" in prfResults && "enabled" in prfResults.prf && !prfResults.prf.enabled)) {
            throw new Error("The authenticator you used does not yet support some required features. Try using a different authenticator or use password-based authentication.");
        }

        const aesKey = await generateAESKey();
        localStorage.setItem("aesKey", aesKey);

        const prf = new TextDecoder('utf-8').decode((prfResults as PRFExtensionWithResults).prf.results.first);
        const user = await authenticate(assertion, stayLogged, await encryptAESKey(prf, aesKey));
        localStorage.setItem("name", user.name);

        await navigate("/setup/step3")
    }

    async function handleClick() {
        loading = true;
        try {
            await handleAuthentication();
        } catch (e) {
            if (!(e instanceof Error)) {
                toast.error("An unknown error occurred. Please try again.");
            } else if (e.name === "NotAllowedError") {
                toast.error("The operation was aborted or timed out. Please try again.");
            } else {
                toast.error(e.message);
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
    <Button class="w-64 mb-6" onclick={handleClick}>
        <Icon.Passkey variant="dark" />
        Encrypt my Data
        {#if loading}
            <Loader borderB="border-b-black" class="justify-self-end"/>
        {/if}
    </Button>
</div>
