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
    type SelectOptionType,
  } from "flowbite-svelte";
  import { getVolTxns } from "$lib/api";
  import type { VolTxnsQuery } from "$lib/api";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { select_option } from "$lib/utils";

  let loading = false;
  let fromDate = format(new Date(), "yyyy-MM-dd");
  let toDate = format(new Date(), "yyyy-MM-dd");
  let selectedChain = "Ethereum";
  let selectedCycle = "daily";
  let chartCanvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  let data: any[] = [];

  const chains = select_option(["Ethereum", "BSC", "Polygon"]);

  const cycles = select_option(["daily", "weekly", "monthly", "yearly"]);

  function updateChart() {
    if (!chartCanvas || !data.length) return;

    if (chart) {
      chart.destroy();
    }

    const ctx = chartCanvas.getContext("2d");
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => format(new Date(item.time), "yyyy-MM-dd")),
        datasets: [
          {
            label: "Volume",
            data: data.map((item) => item.volume),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Transactions",
            data: data.map((item) => item.txns),
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
          },
        },
      },
    });
  }

  $: if (data.length) {
    updateChart();
  }

  async function handleSubmit() {
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
      console.error(error);
      alert("Failed to fetch data");
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-6">
    <h2 class="text-2xl font-bold mb-4">Volume & Transactions Query</h2>

    <form
      on:submit|preventDefault={handleSubmit}
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

      <div class="md:col-span-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Query"}
        </Button>
      </div>
    </form>
  </Card>

  {#if data.length > 0}
    <Card class="mb-6" size="none">
      <canvas bind:this={chartCanvas}></canvas>
    </Card>

    <Card>
      <Table striped={true}>
        <TableHead>
          <TableHeadCell>Time</TableHeadCell>
          <TableHeadCell>Volume</TableHeadCell>
          <TableHeadCell>YoY</TableHeadCell>
          <TableHeadCell>QoQ</TableHeadCell>
          <TableHeadCell>Txns</TableHeadCell>
          <TableHeadCell>Txns YoY</TableHeadCell>
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
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </Card>
  {/if}
</div>
