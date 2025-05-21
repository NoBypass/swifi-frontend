<script lang="ts">
  import type { ColumnDef } from "@tanstack/table-core";
  import { DataTable } from '@components/ui/data-table';
  import { getAllCapitalSources } from '@api_v2/index.ts';
  import type { CapitalSource } from '@model/capitalSource.ts';
  import { Button } from '@components/ui/button';

  const columns: ColumnDef<CapitalSource>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "currency",
      header: "Currency",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "initialBalance",
      header: "Initial Balance",
    },
  ];

  const data = $state(getAllCapitalSources())
</script>

{#await data}
  <p>Loading...</p>
{:then capitalSources}
  <DataTable data={capitalSources} {columns} />
{:catch error}
  {#if error.status === 404}
    <p class="opacity-80 text-sm mt-32">You dont have any Capital Sources!</p>
    <Button variant="outline" size="sm">Create one</Button>
  {:else}
    <p>{error.message}</p>
  {/if}
{/await}
