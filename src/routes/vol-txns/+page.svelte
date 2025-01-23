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

  let loading = $state(false);
  let fromDate = $state(format(new Date(), "yyyy-MM-dd"));
  let toDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state("Ethereum");
  let selectedCycle = $state("daily");
  let chartCanvas: HTMLCanvasElement | undefined = $state();
  let chart: Chart | null = $state(null);
  let data: any[] = $state([]);
  let chartInitialized = $state(false);

  const chains = select_option(["Ethereum", "BSC", "Polygon"]);
  const cycles = select_option(["daily", "weekly", "monthly", "yearly"]);

  $effect(() => {
    if (!chartCanvas || data.length === 0) return;

    // Debounce chart updates
    const timeoutId = setTimeout(() => {
      updateChart();
    }, 100);

    return () => clearTimeout(timeoutId);
  });

  onMount(() => {
    handleSubmit();
  });

  async function updateChart() {
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext("2d");
    if (!ctx) return;

    const chartData = {
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
    };

    if (chart) {
      // Update existing chart instead of destroying
      chart.data = chartData;
      chart.update('none'); // Use 'none' mode for better performance
    } else {
      chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          animation: {
            duration: 0 // Disable animations for better performance
          },
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
      chartInitialized = true;
    }
  }

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

  // Clean up chart on component destroy
  onMount(() => {
    return () => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };
  });
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-6" size="none">
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
    <Card class="mb-6" size="none">
      <canvas bind:this={chartCanvas}></canvas>
    </Card>

    <Card size="none">
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
