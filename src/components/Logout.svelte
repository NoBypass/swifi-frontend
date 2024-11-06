<script lang="ts">
    import {Button} from "@components/ui/button";
    import { navigate } from "astro:transitions/client";
    import {logout} from "@api/auth";

    async function handleClick() {
        const response = await logout();
        if (!response.ok) {
            // todo better error handling
            throw new Error(`${response.status}`);
        }

        localStorage.removeItem("encryptionKey");
        navigate("/login");
    }
</script>

<Button on:click={handleClick} variant="link">Logout</Button>
