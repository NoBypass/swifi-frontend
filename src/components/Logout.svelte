<script lang="ts">
    import {Button} from "@components/ui/button";
    import { navigate } from "astro:transitions/client";
    import {logout} from "@api/auth";
    import * as Icon from "@components/ui/icon";

    async function handleClick() {
        const response = await logout();
        if (!response.ok) {
            // todo better error handling
            throw new Error(`${response.status}`);
        }

        localStorage.removeItem("encryptionKey");
        await navigate("/login");
    }
</script>

<Button on:click={handleClick}
        variant="transparent"
        class="text-red-600 hover:text-red-800 transition-colors duration-150 px-2 w-full justify-start">
    <Icon.Out size="sm" />
    Logout
</Button>
