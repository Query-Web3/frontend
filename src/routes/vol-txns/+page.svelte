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
  import api, { type VolTxnsQuery, type VolTxnsResponse } from "$lib/api";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import { select_option } from "$lib/utils";
  import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-svelte";
  import { dev } from "$app/environment";

  let loading = $state(false);
  let fromDate = $state(dev ? "2024-10-18" : format(new Date(), "yyyy-MM-dd"));
  let toDate = $state(dev ? "2025-01-26" : format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state(dev ? "Hydration" : "Polkadot");
  let selectedCycle = $state("daily");
  let data = $state<VolTxnsResponse[]>([]);
  let totalPages = $state(1);
  let totalItems = $state(0);

  // 选项数据
  const chains = select_option(["Polkadot", "Kusama", "Hydration", "Bifrost"]);
  const cycles = select_option(["daily", "weekly", "monthly", "yearly"]);

  // 分页状态
  let currentPage = $state(1);
  let itemsPerPage = $state(10);

  onMount(() => {
    handleSubmit();
  });

  // 格式化数字
  const formatNumber = (num: number | undefined | null | string): string => {
    if (num === undefined || num === null) return "-";
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(value)) return "-";
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // 格式化百分比
  const formatPercent = (num: number | undefined | null | string): string => {
    if (num === undefined || num === null) return "-";
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(value)) return "-";
    return `${value.toFixed(2)}%`;
  };

  // 检查是否为正数
  const isPositive = (num: number | undefined | null | string): boolean => {
    if (num === undefined || num === null) return false;
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return !isNaN(value) && value >= 0;
  };

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
      const response = await api.getVolTxns(query);
      console.log('Response:', response);
      data = response.data || [];
      // 更新分页信息
      currentPage = response.current_page || 1;
      totalPages = response.total_pages || 1;
      totalItems = response.total_items || 0;
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data");
      data = [];
    } finally {
      loading = false;
    }
  }

  // Export functions will be implemented later
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
          <TableHeadCell>Time</TableHeadCell>
          <TableHeadCell>Volume ($)</TableHeadCell>
          <TableHeadCell>Volume YoY</TableHeadCell>
          <TableHeadCell>Volume QoQ</TableHeadCell>
          <TableHeadCell>Txns</TableHeadCell>
          <TableHeadCell>Txns YoY</TableHeadCell>
          <TableHeadCell>Txns QoQ</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each data as item}
            <TableBodyRow>
              <TableBodyCell>{format(new Date(item.time), "yyyy-MM-dd")}</TableBodyCell>
              <TableBodyCell>{formatNumber(item.volume)}</TableBodyCell>
              <TableBodyCell class={isPositive(item.yoy) ? "text-green-600" : "text-red-600"}>
                {formatPercent(item.yoy)}
              </TableBodyCell>
              <TableBodyCell class={isPositive(item.qoq) ? "text-green-600" : "text-red-600"}>
                {formatPercent(item.qoq)}
              </TableBodyCell>
              <TableBodyCell>{formatNumber(item.txns)}</TableBodyCell>
              <TableBodyCell class={isPositive(item.txns_yoy) ? "text-green-600" : "text-red-600"}>
                {formatPercent(item.txns_yoy)}
              </TableBodyCell>
              <TableBodyCell class={isPositive(item.txns_qoq) ? "text-green-600" : "text-red-600"}>
                {formatPercent(item.txns_qoq)}
              </TableBodyCell>
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
    </div>
  {/if}
</div>
