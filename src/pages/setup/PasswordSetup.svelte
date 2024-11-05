<script lang="ts">
    import {Input} from "@components/ui/input";
    import {Label} from "@components/ui/label";
    import {Button} from "@components/ui/button";
    import {navigate} from "astro:transitions/client";
    import {deriveKey, encryptAESKey, generateAESKey, generateSalt, hashSHA256} from "@util/encryption/keys";
    import {passwordError} from "./setupStore";
    import ErrorAlert from "@components/ErrorAlert.svelte";
    import {getRegistrationOptions, register} from "@api/auth";
    import {Checkbox} from "@components/ui/checkbox";
    import Info from "@components/Info.svelte";

    const apiUrl = import.meta.env.PUBLIC_API_URL;
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let stayLogged = false;

    let email = '';
    let emailBlurred = false;

    let password = '';
    let confirm = '';

    $: match = password === confirm && password.length > 0;
    $: strongPassword = function (): string {
        if (password.length === 0) return '';
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
        return '';
    }()
    $: emailError = emailBlurred && email.length > 0 && !mailRegex.test(email);
    $: canContinue = match && email.length > 0 && mailRegex.test(email);

    async function handleContinue() {
        const opts = await getRegistrationOptions("pass")

        const derivedKey = await deriveKey(
            new TextEncoder().encode(password),
            new TextEncoder().encode(opts.salt))
        const key = await generateAESKey()
        const encryptedKey = await encryptAESKey(derivedKey, key)

        const response = await register({
            encryptedKey: Array.from(new TextEncoder().encode(encryptedKey)),
            hash: Array.from(new Uint8Array(await hashSHA256(password))),
            email: email,
        }, stayLogged)

        if (!response.ok) {
            passwordError.set("An error occurred while setting up encryption. Please try again.");
            return;
        }

        localStorage.setItem("encryptionKey", new TextDecoder().decode(key));

        navigate("/setup/step3");
    }
</script>

<ErrorAlert store={passwordError} />
<form class="flex flex-col gap-4"
      on:submit={() => {if (canContinue) handleContinue()}}>
    <div class="flex flex-col gap-1">
        <Label for="email">Email</Label>
        <Input id="email"
               on:blur={() => emailBlurred = true}
               bind:value={email}
               placeholder="Your Email"
               autocomplete="email" />
        {#if emailError}
            <p class="text-rose-600 text-sm">Please enter a valid email</p>
        {/if}
    </div>

    <div class="flex flex-col gap-1">
        <Label for="password">Password</Label>
        <Input id="password"
               bind:value={password}
               type="password"
               autocomplete="new-password"
               placeholder="A strong, unique Password" />
        {#if strongPassword}
            <p class="text-rose-600 text-sm">{strongPassword}</p>
        {/if}
    </div>

    <div class="flex flex-col gap-1">
        <Label for="confirm">Confirm Password</Label>
        <Input id="confirm"
               bind:value={confirm}
               type="password"
               autocomplete="new-password"
               placeholder="Type your Password again" />
        {#if !match && confirm.length > 0}
            <p class="text-rose-600 text-sm">Passwords don't match</p>
        {/if}
    </div>

    <div class="flex gap-2 items-center mb-6">
        <Checkbox id="stayLogged" bind:checked={stayLogged} />
        <Label for="stayLogged">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
    </div>

    <Button disabled={!canContinue} on:click={handleContinue}>Continue</Button>
</form>
