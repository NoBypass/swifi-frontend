<script lang="ts">
    import * as Avatar from "@components/ui/avatar";
    import { onMount } from 'svelte';

    let name = $state("");
    let email = $state("");

    onMount(() => {
        name = localStorage.getItem("name") || "";
        email = localStorage.getItem("email") || "";
    });
</script>

<div class="flex gap-2 h-10 duration-100 hover:bg-neutral-200 p-1 rounded-2xl">
    <Avatar.Root class="h-8 w-8 rounded-xl">
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <div class="leading-3 mt-0.5 mr-2">
        <p>{name}</p>
        <p class="text-sm opacity-70">{email}</p>
    </div>
</div>

