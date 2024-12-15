<script lang="ts">
    import {createRender, createTable, Render, Subscribe} from "svelte-headless-table";
    import {
        addSelectedRows,
        addHiddenColumns,
    } from "svelte-headless-table/plugins";
    import {readable, writable, type Writable} from "svelte/store";
    import * as Table from "@components/ui/table";
    import * as Icon from "@components/ui/icon";
    import {Button} from "@components/ui/button";
    import TableCheckbox from "@components/TableCheckbox.svelte";
    import {getAllLabels} from "@api/label.ts";
    import {onMount} from "svelte";

    let data: Writable<{
        id: string;
        name: string;
        color: string;
    }[]> = writable([]);

    onMount(async () => {
        data.set(await getAllLabels());
    });

    const table = createTable(data, {
        select: addSelectedRows(),
        hide: addHiddenColumns(),
    });

    const columns = table.createColumns([
        table.column({
            accessor: "id",
            header: "",
            cell: ({ row }, { pluginStates }) => {
                const { getRowState } = pluginStates.select;
                const { isSelected } = getRowState(row);

                return createRender(TableCheckbox, {
                    checked: isSelected,
                });
            },
        }),
        table.column({accessor: "name", header: "",}),
        table.column({accessor: "color", header: "",}),
    ]);

    const { pageRows, tableAttrs, pluginStates, flatColumns, tableBodyAttrs } = table.createViewModel(columns);

    const { selectedDataIds } = pluginStates.select;
    const { hiddenColumnIds } = pluginStates.hide;

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));
    hideForId["id"] = false;

    data.subscribe((value) => {
        console.log(value);
    });
</script>

<Button variant="outline" on:click={() => hideForId["id"] = !hideForId["id"]}>{hideForId["id"] ? "Cancel" : "Select"}</Button>

<div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && "selected"}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
