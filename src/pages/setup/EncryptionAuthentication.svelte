<script lang="ts">
    import {parseLoginOptions, type PublicKeyCredentialWithAssertion} from "@api/auth";
    import {step2Error} from "./setupStore";
    import {deriveKey, encryptAESKey, generateAESKey, generateSalt} from "@util/encryption/keys";
    import {keyToString, type PRFExtension, type PRFExtensionWithResults} from "@util/encryption/util";
    import {Button} from "@components/ui/button";
    import { navigate } from 'astro:transitions/client';

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    async function getEncryptionKey() {
        const response = await fetch(`${apiUrl}/auth/login-options`, {
            credentials: "include",
        });
        const options = parseLoginOptions(await response.json());

        const assertion: PublicKeyCredentialWithAssertion | null = await navigator.credentials.get({
            publicKey: options
        }) as PublicKeyCredentialWithAssertion;
        if (!assertion) throw new Error('Error while getting encryption key configuration');

        const prfResults: PRFExtension = assertion.getClientExtensionResults() as PRFExtension;
        if (!prfResults || !("prf" in prfResults) || ("prf" in prfResults && "enabled" in prfResults.prf && !prfResults.prf.enabled)) {
            throw new Error("The authenticator you used does not yet support some required features. Try using a different authenticator or use password-based authentication.");
        }

        const salt = await generateSalt(32)
        const derivedKey = await deriveKey((prfResults as PRFExtensionWithResults).prf.results.first, salt)
        const key = await generateAESKey()
        const encryptedKey = await encryptAESKey(derivedKey, key)

        const response2 = await fetch(`${apiUrl}/auth/setup-encryption`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isPrf: true,
                encryptedKey: Array.from(new TextEncoder().encode(encryptedKey)),
                prfSalt: Array.from(salt)
            })
        });

        if (!response2.ok) {
            throw new Error("An error occurred while setting up encryption. Please try again.");
        }

        localStorage.setItem("encryptionKey", new TextDecoder().decode(key));

        navigate("/setup/step3")
    }

    async function handleClick() {
        step2Error.set("");
        try {
            await getEncryptionKey();
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
    }
</script>

<div class="self-end flex flex-col">
    <Button class="flex gap-3 mt-4" on:click={handleClick} variant="secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5 fill-neutral-100 stroke-neutral-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
        Encrypt my Data
    </Button>
    {#if $step2Error !== ""}
        <Button size="noPadding"
                variant="link"
                class="self-end"
                on:click={() => navigate("/setup/password")}>
            Use Password Instead
        </Button>
    {/if}
</div>
