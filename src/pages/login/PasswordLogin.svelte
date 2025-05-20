<script lang="ts">
    import {Input} from "@components/ui/input";
    import {Label} from "@components/ui/label";
    import {Button} from "@components/ui/button";
    import {authenticate, getAuthenticationOptions} from "@api/auth";
    import ErrorAlert from "@components/ErrorAlert.svelte";
    import {navigate} from "astro:transitions/client";
    import {onMount} from "svelte";
    import { hashWithSalt } from '@util/encryption/hash.ts';

    let email = $state('');
    let password = $state('');
    let stayLogged = false;
    let error = $state('');

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('stayLogged')) {
            stayLogged = urlParams.get('stayLogged') === 'true';
        }
    });

    async function handleContinue() {
        error = '';

        const salt = await getAuthenticationOptions("password", email);

        await authenticate({ // TODO handle errors
            hash: await hashWithSalt(password, salt),
        }, stayLogged)

        await navigate("/dashboard/overview");
    }
</script>

<form class="flex flex-col gap-4 my-4 w-1/3"
      onsubmit={handleContinue}>
    <ErrorAlert {error} />
    <Input id="email"
           bind:value={email}
           autocomplete="email"
           insetLabel="Email" />

    <Input id="password"
           bind:value={password}
           type="password"
           insetLabel="Password"
           autocomplete="current-password" />

    <Button disabled={email === "" || password === ""} onclick={handleContinue}>Log In</Button>
</form>
