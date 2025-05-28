<script lang="ts">
  import type { ColumnDef } from "@tanstack/table-core";
  import { DataTable } from '@components/ui/data-table';
  import type { CapitalSource } from '@model/capitalSource.ts';
  import { Button } from '@components/ui/button';
  import CreatePopup from './CreatePopup.svelte';
  import { getAllLabels } from '@api_v2/modules/label.ts';

  const columns: ColumnDef<CapitalSource>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "color",
      header: "Color",
    },
  ];

  const data = $state(getAllLabels())
</script>

{#await data}
  <p>Loading...</p>
{:then labels}
  <DataTable hrefBase="/home/labels/" data={labels} {columns} />
{:catch error}
  {#if error.status === 404}
    <p class="opacity-80 text-sm mt-32">You dont have any Labels!</p>
    <CreatePopup>
      <Button variant="outline" size="sm">Create one</Button>
    </CreatePopup>
  {:else}
    <p>{error.message}</p>
  {/if}
{/await}
