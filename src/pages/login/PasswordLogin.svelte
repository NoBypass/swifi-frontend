<script lang="ts">
    import {Input} from "@components/ui/input";
    import {Label} from "@components/ui/label";
    import {Button} from "@components/ui/button";
    import {authenticate, getAuthenticationOptions} from "@api/auth";
    import {hashSHA256} from "@util/encryption/keys";
    import Info from "@components/Info.svelte";
    import {Checkbox} from "@components/ui/checkbox";
    import ErrorAlert from "@components/ErrorAlert.svelte";
    import {navigate} from "astro:transitions/client";
    import {onMount} from "svelte";

    let email = '';
    let password = '';
    let stayLogged = false;
    let error = '';

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('stayLogged')) {
            stayLogged = urlParams.get('stayLogged') === 'true';
        }
    });

    async function handleContinue() {
        error = '';

        const salt = await getAuthenticationOptions("pass", email);
        const hash = Array.from(new Uint8Array((await hashSHA256(password, salt))));

        const response = await authenticate({
            hash: hash,
        }, stayLogged)

        if (!response.ok) {
            error = "An error occurred while logging in. Please try again.";
            return;
        }

        navigate("/dashboard/overview");
    }
</script>

<form class="flex flex-col gap-4 my-4 w-full"
      on:submit={handleContinue}>
    <ErrorAlert {error} />
    <div class="flex flex-col gap-1">
        <Label for="email">Email</Label>
        <Input id="email"
               bind:value={email}
               type="email"
               placeholder="Your Email" />
    </div>

    <div class="flex flex-col gap-1">
        <Label for="password">Password</Label>
        <Input id="password"
               bind:value={password}
               type="password"
               autocomplete="password"
               placeholder="Your Password" />
    </div>

    <Button disabled={email === "" || password === ""} on:click={handleContinue}>Log In</Button>
</form>
