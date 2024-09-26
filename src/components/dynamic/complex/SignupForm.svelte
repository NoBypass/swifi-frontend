<script lang="ts">
    import Input from "../Input.svelte";
    import Button from "../Button.svelte";
    import { navigate } from 'astro:transitions/client';
    import Loader from "../Loader.svelte";

    const apiUrl = import.meta.env.PUBLIC_API_URL;

    let name = '';
    let nameError = '';
    let nameBlurred = false;
    let nameColor: 'primary' | 'success' | 'error' = 'primary';

    let email = '';
    let emailError = '';
    let emailBlurred = false;
    let emailColor: 'primary' | 'success' | 'error' | 'warn' = 'primary';
    let awaitingResponse = false;

    let isButtonDisabled = true;

    $: if (name != undefined && nameBlurred) validateName();
    $: if (email != undefined && emailBlurred) validateEmail();

    function validateName() {
        if (name.length < 3) {
            nameError = 'Name must be at least 3 characters long';
            nameColor = 'error';
        } else {
            nameError = '';
            nameColor = 'success';
        }
    }

    async function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError = 'Please enter a valid email address';
            emailColor = 'error';
        } else {
            awaitingResponse = true;
            emailColor = 'warn';
            let response = await fetch(`${apiUrl}/auth/already-used?email=${email}`);
            if (!response.ok) {
                let body = await response.json();
                emailError = body.message;
                emailColor = 'error';
            } else {
                emailColor = 'success';
                emailError = '';
            }
            awaitingResponse = false;
        }
    }

    $: isButtonDisabled = nameError !== '' || name === '' || awaitingResponse || emailError !== '' || email === '';

    function handleSubmit(event: any) {
        event.preventDefault();
        if (!isButtonDisabled) {
            navigate(`/signup/step2?name=${name.replace(" ", "+")}&email=${email}`);
        }
    }
</script>

<form class="px-48" on:submit={handleSubmit}>
    <Input
            placeholder="What would you like to be called?"
            label="Enter your name"
            maxlength={32}
            bind:value={name}
            on:blur={() => nameBlurred = true}
            color={nameColor}
            description={nameError}
            descriptionColor="error"
            class="mb-4 mt-4"/>
    <Input
            placeholder="Enter your email address"
            label="Enter your email"
            maxlength={128}
            bind:value={email}
            on:blur={() => emailBlurred = true}
            color={emailColor}
            description={emailError}
            descriptionColor="error"
            class="mb-10">
        <div slot="end" class="h-7 grid place-content-center">
            {#if awaitingResponse}
                <Loader borderB="border-b-amber-500" />
            {/if}
        </div>
    </Input>

    <Button disabled={isButtonDisabled}>Continue</Button>
</form>