<script lang="ts">
    import Input from "../Input.svelte";
    import Button from "../Button.svelte";
    import { navigate } from 'astro:transitions/client';
    
    let name = '';
    let nameError = '';
    let nameBlurred = false;
    let nameColor: 'primary' | 'success' | 'error' = 'primary';
    let isButtonDisabled = true;

    $: if (name != undefined && nameBlurred) validateName();

    function validateName() {
        if (name.length < 3) {
            nameError = 'Name must be at least 3 characters long';
            nameColor = 'error';
        } else {
            nameError = '';
            nameColor = 'success';
        }
    }

    $: isButtonDisabled = nameError !== '' || name === ''

    function handleSubmit(event: any) {
        event.preventDefault();
        if (!isButtonDisabled) {
            navigate(`/signup/step2?name=${name.replace(" ", "+")}`);
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
            class="mb-16 mt-6"
    />

    <Button disabled={isButtonDisabled}>Continue</Button>
</form>