<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()

    let className = ''
    export let placeholder = ''
    export let value = ''
    export let label = ''
    export let id = ''
    export let description = ''
    export let descriptionColor: 'neutral' | 'error' = 'neutral'
    export let color: 'primary' | 'success' | 'error' = 'primary'
    export let maxlength = 64

    export { className as class }

    let valWidth = 0
    let inputElem: HTMLInputElement | null = null
    let focused = false
    let cd = false
    let caretPos = 0

    const colors = {
        primary: 'border-neutral-400 has-[:focus]:border-indigo-500 outline-indigo-300',
        success: 'border-emerald-600 has-[:focus]:border-emerald-500 outline-emerald-300',
        error: 'border-rose-600 has-[:focus]:border-rose-500 outline-rose-300'
    }

    const descColors = {
        neutral: 'text-neutral-400',
        error: 'text-rose-500'
    }

    $: {
        if (value !== '' && inputElem) {
            valWidth = Math.min(textWidth(value), inputElem.clientWidth);
            cd = true;
            setTimeout(() => {
                cd = false;
            }, 1000);
        } else {
            valWidth = 0;
        }
    }

    function textWidth(text: string) {
        if (!inputElem) return 0
        const ctx = document.createElement('canvas').getContext('2d')!
        ctx.font = getComputedStyle(inputElem).font
        return ctx.measureText(text).width
    }

    function focusOnParentClick(node: HTMLInputElement) {
        const handleClick = () => node.focus()
        node.parentNode!.addEventListener('click', handleClick)

        return {
            destroy() {
                node.parentNode!.removeEventListener('click', handleClick)
            }
        }
    }

    function updateCaretPosition() {
        requestAnimationFrame(() => {
            if (!inputElem) return;
            caretPos = inputElem.selectionStart || 0;
            const textUntilCaret = value.slice(0, caretPos);
            valWidth = Math.min(textWidth(textUntilCaret), inputElem.clientWidth);
        });
    }

    function blur() {
        dispatch('blur')
        focused = false
    }
</script>

<div class="{className} text-start">
    <label for={id} class="text-neutral-600 pl-px">{label}</label>
    <div class="cursor-text flex border px-2 rounded-lg has-[:focus]:outline has-[:focus]:outline-offset-2 outline-offset-0 duration-150 outline-1 transition-all {colors[color]}">
        <span style="transform: translateY(4px) translateX({valWidth-3}px)"
              class="{focused ? '' : 'hidden'} absolute bg-black ml-1 w-px h-5 transition-all duration-50 {cd ? '' : 'animate-blink'}" />
        <slot name="start" />
        <input type="text"
               id={id}
               use:focusOnParentClick
               maxlength={maxlength}
               class="placeholder:text-neutral-400 placeholder:text-sm py-0.5 caret-transparent w-full bg-transparent color-neutral-100 focus:outline-none"
               placeholder={focused ? '' : placeholder}
               bind:this={inputElem}
               on:focus={() => focused = true}
               on:blur={blur}
               on:input={updateCaretPosition}
               on:keydown={updateCaretPosition}
               on:mousedown={updateCaretPosition}
               bind:value />
        <slot name="end" />
    </div>
    {#if description !== ''}
        <p class="mt-1 {descColors[descriptionColor]} absolute text-sm mb-1">{description}</p>
    {/if}
</div>
