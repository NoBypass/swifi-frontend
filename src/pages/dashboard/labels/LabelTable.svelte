<script lang="ts">
    import {
        type ColumnDef,
        getCoreRowModel,
        type RowSelectionState,
        type VisibilityState,
    } from '@tanstack/table-core';
    import * as Table from "@components/ui/table";
    import * as Icon from "@components/ui/icon";
    import {
        createSvelteTable,
        FlexRender, renderComponent,
    } from '@components/ui/data-table';
    import { type Label } from '@api/label.ts';
    import TableCheckbox from '@components/TableCheckbox.svelte';
    import { Button } from '@components/ui/button';
    import { labelCreateEvent } from './labelEvents.ts';

    let { data }: { data: Label[] } = $props();

    labelCreateEvent.addListener((label: Label) => {
        data = [...data, label];
    });

    let columnVisibility = $state<VisibilityState>({});
    let rowSelection = $state<RowSelectionState>({});
    let selecting = $state(false);

    const columns: ColumnDef<Label>[] = [
        {
            id: 'select',
            cell: ({ row }) => renderComponent(TableCheckbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value: any) => row.toggleSelected(!!value),
            }),
            enableHiding: true,
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'color',
            header: 'Color',
        }
    ];

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: (updater) => {
            if (typeof updater === "function") {
                rowSelection = updater(rowSelection);
            } else {
                rowSelection = updater;
            }
        },
        onColumnVisibilityChange: (updater) => {
            if (typeof updater === "function") {
                columnVisibility = updater(columnVisibility);
            } else {
                columnVisibility = updater;
            }
        },
        state: {
            get rowSelection() {
                return rowSelection;
            },
            get columnVisibility() {
                return columnVisibility;
            }
        }

    });

    table.getColumn('select')!.toggleVisibility(selecting);

    const select = () => {
        table.getColumn('select')!.toggleVisibility(!selecting);
        selecting = !selecting;
    }
</script>

<Button onclick={select}>{selecting ? 'Cancel' : 'Select'}</Button>

<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row>
                    {#each headerGroup.headers as header (header.id)}
                        <Table.Head>
                            {#if !header.isPlaceholder}
                                <FlexRender
                                  content={header.column.columnDef.header}
                                  context={header.getContext()}
                                />
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body>
            {#each table.getRowModel().rows as row (row.id)}
                <Table.Row data-state={row.getIsSelected() && "selected"}>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <Table.Cell>
                            <FlexRender
                              content={cell.column.columnDef.cell}
                              context={cell.getContext()}
                            />
                        </Table.Cell>
                    {/each}
                </Table.Row>
            {:else}
                <Table.Row>
                    <Table.Cell colspan={columns.length} class="h-24 text-center">
                        No labels found.
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
