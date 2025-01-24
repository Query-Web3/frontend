<script lang="ts">
  import {
    Button,
    Card,
    Select,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Label,
    Pagination,
    type SelectOptionType,
  } from "flowbite-svelte";
  import { getVolTxns } from "$lib/api";
  import type { VolTxnsQuery } from "$lib/api";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import { select_option } from "$lib/utils";
  import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-svelte";

  let loading = $state(false);
  let fromDate = $state(format(new Date(), "yyyy-MM-dd"));
  let toDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state("Polkadot");
  let selectedCycle = $state("daily");
  let data: any[] = $state([]);

  const chains = select_option(["Polkadot", "Kusama", "Hydration", "Bifrost"]);
  const cycles = select_option(["daily", "weekly", "monthly", "yearly"]);

  // Pagination state
  let currentPage = $state(1);
  let itemsPerPage = $state(10);

  onMount(() => {
    handleSubmit();
  });

  async function handleSubmit(e?: Event) {
    e?.preventDefault();

    if (!fromDate || !toDate) {
      alert("Please select dates");
      return;
    }

    const query: VolTxnsQuery = {
      from_date: fromDate,
      to_date: toDate,
      chain: selectedChain,
      cycle: selectedCycle,
    };

    try {
      loading = true;
      const response = await getVolTxns(query);
      data = response.data;
    } catch (error) {
      // console.error(error);
      // alert("Failed to fetch data");
    } finally {
      loading = false;
    }
  }

  // Export functions
  async function exportToPDF() {
    // Implementation for PDF export
  }

  async function exportToExcel() {
    // Implementation for Excel export
  }
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-3" size="none">
    <h2 class="text-2xl font-bold mb-4">Volume & Transactions Query</h2>

    <form
      onsubmit={handleSubmit}
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
    >
      <div>
        <Label for="fromDate" class="mb-2">From Date</Label>
        <input
          id="fromDate"
          type="date"
          bind:value={fromDate}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div>
        <Label for="toDate" class="mb-2">To Date</Label>
        <input
          id="toDate"
          type="date"
          bind:value={toDate}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div>
        <Label for="chain" class="mb-2">Chain</Label>
        <Select id="chain" bind:value={selectedChain} items={chains} />
      </div>

      <div>
        <Label for="cycle" class="mb-2">Cycle</Label>
        <Select id="cycle" bind:value={selectedCycle} items={cycles} />
      </div>

      <div class="md:col-span-4 flex items-center justify-center">
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Query"}
        </Button>
      </div>
    </form>
  </Card>

  {#if data.length > 0}
    <Card class="mb-3" size="none">
      <Table striped={true}>
        <TableHead>
          <TableHeadCell>time</TableHeadCell>
          <TableHeadCell>vol($)</TableHeadCell>
          <TableHeadCell>yoy</TableHeadCell>
          <TableHeadCell>qoq</TableHeadCell>
          <TableHeadCell>txns</TableHeadCell>
          <TableHeadCell>yoy</TableHeadCell>
          <TableHeadCell>qoq</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each data as item}
            <TableBodyRow>
              <TableBodyCell
                >{format(new Date(item.time), "yyyy-MM-dd")}</TableBodyCell
              >
              <TableBodyCell>{item.volume.toFixed(2)}</TableBodyCell>
              <TableBodyCell
                >{item.yoy ? `${item.yoy.toFixed(2)}%` : "-"}</TableBodyCell
              >
              <TableBodyCell
                >{item.qoq ? `${item.qoq.toFixed(2)}%` : "-"}</TableBodyCell
              >
              <TableBodyCell>{item.txns.toLocaleString()}</TableBodyCell>
              <TableBodyCell
                >{item.txns_yoy
                  ? `${item.txns_yoy.toFixed(2)}%`
                  : "-"}</TableBodyCell
              >
              <TableBodyCell>{item.txns.toLocaleString()}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </Card>

    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <Button color="light" on:click={exportToPDF}>
          <IconFileTypePdf class="w-5 h-5 mr-2" />
          Export PDF
        </Button>
        <Button color="light" on:click={exportToExcel}>
          <IconFileTypeXls class="w-5 h-5 mr-2" />
          Export Excel
        </Button>
      </div>
      <div class="flex items-center gap-4">
        <Select
          class="w-24"
          items={[
            { value: "10", name: "10" },
            { value: "25", name: "25" },
            { value: "50", name: "50" },
            { value: "100", name: "100" },
          ]}
          bind:value={itemsPerPage}
        />
      </div>
    </div>
  {/if}
</div>
