<script lang="ts">
    import Loader from "@components/dynamic/Loader.svelte";
    import {Button} from "@components/ui/button";
    import * as Icon from "@components/ui/icon";
    import {getRegistrationOptions, type PublicKeyCredentialWithTransports, register} from "@api/auth.ts";
    import {type PRFExtension, supportsPRF} from "@util/encryption/util.ts";
    import { toast } from "svelte-sonner";
    import { cn } from "@util/shadcn.js";
    import { navigate } from 'astro:transitions/client';

    let awaiting = $state(false);

    let {
        class: className = "",
        text = "Set up Passkey"
    } = $props();

    class UnsupportedAuthenticatorError extends Error {
        constructor(message: string) {
            super(message);
            this.name = this.constructor.name;
        }
    }

    async function handleClick() {
        awaiting = true;
        try {
            await handleRegistration();
            toast.success("Passkey successfully set up!");
        } catch (e) {
            if (!(e instanceof Error)) {
                toast.error("An unknown error occurred. Please try again.");
            } else if (e.name === "NotAllowedError") {
                toast.error("The operation was aborted or timed out. Please try again.");
            } else if (e instanceof UnsupportedAuthenticatorError) {
                toast.error("Unsupported Authenticator", {
                    description: e.message,
                });
            } else {
                toast.error(e.message);
            }
        }
        awaiting = false;
    }

    async function handleRegistration() {
        const opts = await getRegistrationOptions("webauthn", localStorage.getItem("name") || "");

        const credential: PublicKeyCredentialWithTransports | null = await navigator.credentials.create({
            publicKey: opts.options as PublicKeyCredentialCreationOptions
        }) as PublicKeyCredentialWithTransports;
        if (!credential) return null;
        if (!supportsPRF(credential.getClientExtensionResults() as PRFExtension)) {
            throw new UnsupportedAuthenticatorError("The authenticator you used does not yet support a required feature. Try using a different authenticator or use password-based authentication.");
        }

        await register(credential, true);
        await navigate("/setup/step3");
    }
</script>

<Button class={cn(className, "gap-2")} variant="primary" onclick={handleClick}>
    <Icon.Passkey variant="light" />
    <p class="text-sm">{text}</p>
    {#if awaiting}
        <Loader borderB="border-b-white" class="justify-self-end"/>
    {/if}
</Button>
