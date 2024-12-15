<script lang="ts">
    import {createRender, createTable, Render, Subscribe} from "svelte-headless-table";
    import {
        addSelectedRows,
        addHiddenColumns,
    } from "svelte-headless-table/plugins";
    import {readable} from "svelte/store";
    import * as Table from "@components/ui/table";
    import * as Icon from "@components/ui/icon";
    import * as DropdownMenu from "@components/ui/dropdown-menu";
    import {Button} from "@components/ui/button";
    import TableCheckbox from "@components/TableCheckbox.svelte";

    const data = [
        {
            id: "nvc4378yw09",
            name: "Zalando Purchase",
            amount: {
                amount: 155.95,
                currency: "CHF",
            },
            at: "2021-09-01T12:00:00Z",
            labels: ["mv0h7a4w", "vmn7w398t5"],
            account: "hfcn437892",
            merchant: "7v94nset4a",
        }
    ]

    const table = createTable(readable(data), {
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
        table.column({
            accessor: "merchant",
            header: "Merchant",
        }),
        table.column({
            accessor: "name",
            header: "Name",
        }),
        table.column({
            accessor: "amount",
            header: "Amount",
            cell: ({ value }) => {
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: value.currency,
                }).format(value.amount);
            },
        }),
        table.column({
            accessor: "account",
            header: "Account",
        }),
        table.column({
            accessor: "at",
            header: "Date",
        }),
        table.column({
            accessor: "labels",
            header: "Labels",
        }),
    ]);

    const { headerRows, pageRows, tableAttrs, pluginStates, flatColumns, tableBodyAttrs } = table.createViewModel(columns);

    const { selectedDataIds } = pluginStates.select;
    const { hiddenColumnIds } = pluginStates.hide;

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));
    hideForId["id"] = false;

    $: $hiddenColumnIds = Object.entries(hideForId)
        .filter(([, hide]) => !hide)
        .map(([id]) => id);

    const hidableCols = ["account", "at", "labels", "merchant"];

    $: console.log($selectedDataIds);
</script>

<Button variant="outline" on:click={() => {
    hideForId["id"] = !hideForId["id"];
}}>{hideForId["id"] ? "Cancel" : "Select"}</Button>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" class="ml-auto" builders={[builder]}>
            Columns <Icon.Down size="sm" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        {#each flatColumns as col}
            {#if hidableCols.includes(col.id)}
                <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
                    {col.header}
                </DropdownMenu.CheckboxItem>
            {/if}
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>

<div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                                <Table.Head {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
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
