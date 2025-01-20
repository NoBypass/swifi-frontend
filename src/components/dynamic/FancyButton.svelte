<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    let rotation = $state(0);
    let intervalId: number;

    onMount(() => {
        intervalId = setInterval(() => {
            rotation = (rotation + 1) % 360;
        }, 10);

        return () => clearInterval(intervalId);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<button class="relative inline-flex items-center justify-center p-px mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group"
        onclick={() => window.location.href = '/setup/start'}
        style="background: conic-gradient(from {rotation}deg, #4f46e5, #f59e0b, #4f46e5);">
    <span class="relative px-5 py-2.5 transition-all ease-in duration-100 bg-white rounded-md group-hover:bg-neutral-100">
        {@render children?.()}
    </span>
</button>