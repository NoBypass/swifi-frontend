<script lang="ts">
    import { run } from 'svelte/legacy';

    import {createEventDispatcher, onMount} from 'svelte';
    const dispatch = createEventDispatcher()

    interface Props {
        class?: string;
        storageId?: string;
        placeholder?: string;
        value?: string;
        label?: string;
        id?: string;
        description?: string;
        descriptionColor?: 'neutral' | 'error';
        color?: 'primary' | 'success' | 'error' | 'warn';
        maxlength?: number;
        censorFn?: (value: string) => string;
        start?: import('svelte').Snippet;
        end?: import('svelte').Snippet;
    }

    let {
        class: className = '',
        storageId = '',
        placeholder = '',
        value = $bindable(''),
        label = '',
        id = '',
        description = '',
        descriptionColor = 'neutral',
        color = 'primary',
        maxlength = 64,
        censorFn = (value) => value,
        start,
        end
    }: Props = $props();

    

    let valWidth = $state(0)
    let inputElem: HTMLInputElement | null = $state(null)
    let focused = $state(false)
    let cd = $state(false)
    let caretPos = 0
    let mounted = $state(false)

    const colors = {
        primary: 'border-neutral-400 has-[:focus]:border-indigo-500 outline-indigo-300',
        success: 'border-emerald-600 has-[:focus]:border-emerald-500 outline-emerald-300',
        error: 'border-rose-600 has-[:focus]:border-rose-500 outline-rose-300',
        warn: 'border-amber-600 has-[:focus]:border-amber-500 outline-amber-300'
    }

    const descColors = {
        neutral: 'text-neutral-400',
        error: 'text-rose-500'
    }

    onMount(() => {
        if (storageId !== '') {
            value = localStorage.getItem(storageId) || ''
        }
        mounted = true
    })



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
    run(() => {
        if (value !== '' && inputElem) {
            value = censorFn(value);
            valWidth = Math.min(textWidth(value), inputElem.clientWidth);
            cd = true;
            setTimeout(() => {
                cd = false;
            }, 1000);
        } else {
            valWidth = 0;
        }
    });
    run(() => {
        if (storageId !== '' && mounted) {
            localStorage.setItem(storageId, value);
        }
    });
</script>

<div class="{className} text-start">
    <label for={id} class="text-neutral-600 pl-px">{label}</label>
    <div class="cursor-text flex border px-2 rounded-lg has-[:focus]:outline has-[:focus]:outline-offset-2 outline-offset-0 duration-150 outline-1 transition-all {colors[color]}">
        <span style="transform: translateY(4px) translateX({valWidth-3}px)"
              class="{focused ? '' : 'hidden'} absolute bg-black ml-1 w-px h-5 transition-all duration-50 {cd ? '' : 'animate-blink'}"></span>
        {@render start?.()}
        <input type="text"
               id={id}
               use:focusOnParentClick
               maxlength={maxlength}
               class="placeholder:text-neutral-400 placeholder:text-sm py-0.5 caret-transparent w-full bg-transparent color-neutral-100 focus:outline-none"
               placeholder={focused ? '' : placeholder}
               bind:this={inputElem}
               onfocus={() => focused = true}
               onblur={blur}
               oninput={updateCaretPosition}
               onkeydown={updateCaretPosition}
               onmousedown={updateCaretPosition}
               bind:value />
        {@render end?.()}
    </div>
    {#if description !== ''}
        <p class="mt-1 {descColors[descriptionColor]} absolute text-sm mb-1">{description}</p>
    {/if}
</div>
