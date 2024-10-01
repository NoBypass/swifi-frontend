<script lang="ts">
    import Input from "../Input.svelte";
    import Button from "../Button.svelte";
    import { navigate } from 'astro:transitions/client';
    import {Checkbox} from "@components/ui/checkbox";
    import {Label} from "@components/ui/label";
    import Info from "@components/dynamic/complex/Info.svelte";

    let name = '';
    let nameError = '';
    let nameBlurred = false;
    let nameColor: 'primary' | 'success' | 'error' = 'primary';

    let stayLogged = false;
    let isButtonDisabled = true;

    $: if (name != undefined && nameBlurred) validateName();

    function validateName() {
        if (name === '') {
            nameError = 'Please enter your name';
            nameColor = 'error';
        } else {
            nameError = '';
            nameColor = 'success';
        }
    }

    $: isButtonDisabled = nameError !== '' || name === '';

    function handleSubmit(event: any) {
        event.preventDefault();
        if (!isButtonDisabled) {
            navigate(`/signup/step1?name=${name.replace(" ", "+")}&stayLogged=${stayLogged}`);
        }
    }
</script>

<form on:submit={handleSubmit}>
    <Input placeholder="What would you like to be called?"
           storageId="signup_name"
           label="Enter your name"
           maxlength={32}
           bind:value={name}
           on:blur={() => nameBlurred = true}
           color={nameColor}
           description={nameError}
           descriptionColor="error"
           class="mb-7 mt-4"/>
    <div class="flex gap-2 items-center mb-6">
        <Checkbox id="stayLogged" bind:checked={stayLogged} />
        <Label for="stayLogged">Stay logged in? <Info text="Stay logged in until you log out manually, otherwise for 30 days" /></Label>
    </div>

    <Button class="w-full flex gap-2 justify-center" disabled={isButtonDisabled}>
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
    </Button>
</form>