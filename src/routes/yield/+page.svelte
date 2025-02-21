<script lang="ts">
  import {
    Button,
    Select,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Label,
    Card,
  } from "flowbite-svelte";
  import { getYield } from "$lib/api";
  import type { YieldQuery } from "$lib/api";
  import { format } from "date-fns";
  import { select_option } from "$lib/utils";
  import { onMount } from "svelte";
  import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-svelte";
  import { jsPDF } from "jspdf";
  import autoTable from "jspdf-autotable";
  import * as XLSX from "xlsx";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import CustomPagination from '$lib/components/CustomPagination.svelte';

  let loading = $state(false);
  let selectedDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state("Polkadot");
  let selectedAssetType = $state("DeFi");
  let selectedReturnType = $state("");
  let selectedToken = $state("");
  let totalPages = $state(1000);
  let itemsPerPage = $state(10);

  // Get current page from URL parameters
  let currentPage = $derived(
    parseInt(page.url.searchParams.get("page") || "1")
  );

  let data: any[] = $state([]);

  const chains = select_option(["Polkadot", "Kusama", "Hydration", "Bifrost"]);
  const assetTypes = select_option(["DeFi", "GameFi", "NFT"]);
  const returnTypes = select_option(["", "Staking", "Farming", "Lending"]);
  const tokens = select_option(["", "ETH", "USDT", "USDC", "DAI"]);

  onMount(() => {
    handleSubmit();
  });

  async function handleSubmit(e?: Event) {
    e?.preventDefault();
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    const query: YieldQuery = {
      date: selectedDate,
      chain: selectedChain,
      asset_type: selectedAssetType,
      return_type: selectedReturnType || undefined,
      token: selectedToken || undefined,
    };

    try {
      loading = true;
      const response = await getYield(query);
      data = response.data;
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data");
    } finally {
      loading = false;
    }
  }

  function exportToPDF() {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Yield Query Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, 14, 22);

    // Add filter information
    doc.text(
      [
        `Chain: ${selectedChain}`,
        `Asset Type: ${selectedAssetType}`,
        `Return Type: ${selectedReturnType || "All"}`,
        `Token: ${selectedToken || "All"}`,
        `Date: ${selectedDate}`,
      ],
      14,
      30
    );

    // Define table headers based on your data structure
    const headers = [
      "Protocol",
      "Chain",
      "Asset Type",
      "Return Type",
      "Token",
      "APY",
      "TVL",
    ];

    // Transform data for the table
    const tableData = data.map((row) => [
      row.protocol,
      row.chain,
      row.asset_type,
      row.return_type,
      row.token,
      `${(row.apy * 100).toFixed(2)}%`,
    ]);

    // Generate the table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 50,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save the PDF
    doc.save(`yield-report-${selectedDate}.pdf`);
  }

  function exportToExcel() {
    // Create worksheet data
    const headers = [
      "Protocol",
      "Chain",
      "Asset Type",
      "Return Type",
      "Token",
      "APY",
      "TVL",
    ];

    const excelData = [
      // Add filter information
      ["Yield Query Report"],
      [`Generated on: ${format(new Date(), "yyyy-MM-dd HH:mm")}`],
      [""],
      [`Chain: ${selectedChain}`],
      [`Asset Type: ${selectedAssetType}`],
      [`Return Type: ${selectedReturnType || "All"}`],
      [`Token: ${selectedToken || "All"}`],
      [`Date: ${selectedDate}`],
      [""],
      // Add headers
      headers,
      // Add data rows
      ...data.map((row) => [
        row.protocol,
        row.chain,
        row.asset_type,
        row.return_type,
        row.token,
        (row.apy * 100).toFixed(2) + "%",
      ]),
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Protocol
      { wch: 15 }, // Chain
      { wch: 15 }, // Asset Type
      { wch: 15 }, // Return Type
      { wch: 15 }, // Token
      { wch: 10 }, // APY
      { wch: 15 }, // TVL
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Yield Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `yield-report-${selectedDate}.xlsx`);
  }

  // Generate pagination items with ellipsis for large page counts
  function generatePaginationItems(
    current: number,
    total: number
  ): Array<{ name: string; href: string; active?: boolean }> {
    const items: Array<{ name: string; href: string; active?: boolean }> = [];
    const delta = 2; // Number of pages to show before and after current page

    // Always add first page
    items.push({
      name: "1",
      href: `?page=1`,
      active: current === 1,
    });

    // Calculate range of pages to show
    let rangeStart = Math.max(2, current - delta);
    let rangeEnd = Math.min(total - 1, current + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      items.push({ name: "...", href: "#" });
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push({
        name: i.toString(),
        href: `?page=${i}`,
        active: i === current,
      });
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < total - 1) {
      items.push({ name: "...", href: "#" });
    }

    // Always add last page if not already included
    if (total > 1) {
      items.push({
        name: total.toString(),
        href: `?page=${total}`,
        active: current === total,
      });
    }

    return items;
  }

  // Handle page change
  async function handlePageChange(page: number) {
    // Update URL with new page number
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    await goto(url.toString(), { replaceState: true });
    handleSubmit();
  }
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-3" size="none">
    <h2 class="text-2xl font-bold mb-4">Yield Query</h2>

    <form
      onsubmit={handleSubmit}
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4"
    >
      <div>
        <Label for="date" class="mb-2">Date</Label>
        <input
          id="date"
          type="date"
          bind:value={selectedDate}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>

      <div>
        <Label for="chain" class="mb-2">Chain</Label>
        <Select id="chain" bind:value={selectedChain} items={chains} />
      </div>

      <div>
        <Label for="assetType" class="mb-2">Asset Type</Label>
        <Select
          id="assetType"
          bind:value={selectedAssetType}
          items={assetTypes}
        />
      </div>

      <div>
        <Label for="returnType" class="mb-2">Return Type</Label>
        <Select
          id="returnType"
          bind:value={selectedReturnType}
          items={returnTypes}
        />
      </div>

      <div>
        <Label for="token" class="mb-2">Token</Label>
        <Select id="token" bind:value={selectedToken} items={tokens} />
      </div>

      <div class="md:col-span-5 flex items-center justify-center">
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
          <TableHeadCell>Token</TableHeadCell>
          <TableHeadCell>APY</TableHeadCell>
          <TableHeadCell>TVL ($)</TableHeadCell>
          <TableHeadCell>Price ($)</TableHeadCell>
          <TableHeadCell>Chain</TableHeadCell>
          <TableHeadCell>Return Type</TableHeadCell>
          <TableHeadCell>24H Vol ($)</TableHeadCell>
          <TableHeadCell>24H Txns</TableHeadCell>
          <TableHeadCell>Asset Type</TableHeadCell>
          <TableHeadCell>Date</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each data as item}
            <TableBodyRow>
              <TableBodyCell>{item.token}</TableBodyCell>
              <TableBodyCell>{item.apy.toFixed(2)}%</TableBodyCell>
              <TableBodyCell>${item.tvl_usd.toLocaleString()}</TableBodyCell>
              <TableBodyCell>${item.price_usd.toFixed(2)}</TableBodyCell>
              <TableBodyCell>{item.chain}</TableBodyCell>
              <TableBodyCell>{item.return_type}</TableBodyCell>
              <TableBodyCell>${item.vol_24h_usd.toLocaleString()}</TableBodyCell
              >
              <TableBodyCell>{item.txns_24h.toLocaleString()}</TableBodyCell>
              <TableBodyCell>{item.asset_type}</TableBodyCell>
              <TableBodyCell
                >{format(new Date(item.date), "yyyy-MM-dd")}</TableBodyCell
              >
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
        <CustomPagination
          {currentPage}
          {totalPages}
          onPrevious={() => handlePageChange(Math.max(1, currentPage - 1))}
          onNext={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        />
      </div>
    </div>
  {/if}
</div>
