<script lang="ts">
    export let currStep = 0;

    type Step = {
        title?: string;
        path?: string;
        isConnection?: boolean;
        isActive?: boolean;
        done?: boolean;
    }

    let steps: Step[] = [
        {
            title: 'Start',
            path: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />',
        },
        {
            title: 'Create your Profile',
            path: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
        },
        {
            title: 'Import Contacts',
            path: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />',
        },
        {
            title: 'Add Bank Accounts',
            path: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />',
        }
    ]

    steps = steps.map((step, i) => ({
        ...step,
        isActive: i === currStep,
        done: i < currStep
    })).flatMap((step, i, arr) =>
        i === arr.length - 1 ? step : [step, { isConnection: true }]
    );
</script>

<ul class="grid grid-rows-1 mt-8"
    style="grid-template-columns: repeat({steps.length+2}, minmax(0, 1fr))">
    {#each steps as step, i}
        <li class="flex flex-col items-center"
            style="grid-column-start: {i+2}">
            {#if step.isConnection}
                <div class="w-full px-1 mt-5">
                    <div class="w-full h-1 bg-neutral-200 rounded-full"></div>
                </div>
            {:else}
                {#if step.isActive}
                    <div class="rounded-xl bg-indigo-500/[.3] p-1.5">
                        <svg class="size-8 stroke-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {@html step.path}
                        </svg>
                    </div>
                    <p class="text-indigo-500 text-sm">{step.title}</p>
                {:else if step.done}
                    <div class="rounded-xl bg-emerald-500/[.3] p-1.5">
                        <svg class="size-6 stroke-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {@html step.path}
                        </svg>
                    </div>
                    <p class="text-emerald-500 text-sm">{step.title}</p>
                {:else}
                    <div class="rounded-xl bg-neutral-300/[.3] p-1.5">
                        <svg class="size-6 stroke-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            {@html step.path}
                        </svg>
                    </div>
                    <p class="text-neutral-300 text-sm">{step.title}</p>
                {/if}
            {/if}
        </li>
    {/each}
</ul>
