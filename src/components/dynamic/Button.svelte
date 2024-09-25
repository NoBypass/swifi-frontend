<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { twMerge } from 'tailwind-merge'
    import { createEventDispatcher } from 'svelte';

    let className: string = '';
    export {className as class};
    export let animate: boolean = false;
    export let style: 'primary' | 'secondary' | 'transparent' = 'primary';
    export let disabled: boolean = false;

    let offset = 0;
    let intervalId: number;
    let hovered = false;
    const width = 25;
    const dispatch = createEventDispatcher();

    onMount(() => {
        if (!animate) return;
        intervalId = setInterval(() => {
            if (offset >= 100+width) offset = -250;
            offset++;
        }, 7);

        return () => clearInterval(intervalId);
    });

    $: aniation = animate && !hovered ? `background: linear-gradient(70deg, #6366f1 ${offset - width}%, #818cf8 ${offset}%, #6366f1 ${offset + width}%)` : '';

    onDestroy(() => {
        clearInterval(intervalId);
    });

    const styles = {
        primary: 'hover:bg-indigo-600 bg-indigo-500 text-white',
        secondary: 'hover:bg-neutral-300 bg-neutral-200 text-neutral-800 border border-neutral-300',
        transparent: 'bg-transparent text-neutral-800 *:stroke-neutral-400 *:hover:stroke-neutral-500'
    };
</script>

<button on:mouseenter={() => hovered = true}
        on:mouseleave={() => hovered = false}
        on:click={() => dispatch('click')}
        disabled={disabled}
        class={twMerge(`${disabled ? 'bg-neutral-200 text-neutral-400' : `${styles[style]} hover:scale-105`} px-5 py-1.5 rounded-md transition-transform duration-150 ease-in-out`, className)}
        style={aniation}>
    <slot />
</button>