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
    type SelectOptionType,
  } from "flowbite-svelte";
  import api, {
    CHAINS,
    ASSET_TYPES,
    RETURN_TYPES,
    type Chain,
    type AssetType,
    type ReturnType,
    type YieldQuery,
    type YieldResponse,
    type PageResponse,
  } from "$lib/api";
  import { format } from "date-fns";
  import { select_option } from "$lib/utils";
  import { onMount } from "svelte";
  import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-svelte";
  import { jsPDF } from "jspdf";
  import autoTable from "jspdf-autotable";
  import * as XLSX from "xlsx";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import CustomPagination from "$lib/components/CustomPagination.svelte";

  let loading = $state(false);
  let selectedDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state<Chain>("Hydration");
  let selectedAssetType = $state<AssetType>("DeFi");
  let selectedReturnType = $state<ReturnType>("Staking");
  let selectedToken = $state("TKN1");
  let totalPages = $state(1000);
  let itemsPerPage = $state(10);

  // 选项数据
  let chains = $state<SelectOptionType<Chain>[]>([]);
  let assetTypes = $state<SelectOptionType<AssetType>[]>([]);
  let returnTypes = $state<SelectOptionType<ReturnType>[]>([]);
  let tokens = $state<SelectOptionType<string>[]>([]);

  // Get current page from URL parameters
  let currentPage = $derived(
    parseInt(page.url.searchParams.get("page") || "1"),
  );

  let data = $state<YieldResponse[]>([]);

  // 加载选项数据
  async function loadOptions() {
    try {
      const [chainsData, assetTypesData, returnTypesData, tokensData] =
        await Promise.all([
          api.getChains(),
          api.getAssetTypes(),
          api.getReturnTypes(),
          api.getTokens(),
        ]);

      chains = select_option(chainsData);
      assetTypes = select_option(assetTypesData);
      returnTypes = select_option([...returnTypesData] as ReturnType[]); // 添加空选项
      tokens = select_option([...tokensData]); // 添加空选项

      // 如果当前选择的值不在选项中，重置为第一个选项
      if (!chainsData.includes(selectedChain)) {
        selectedChain = chainsData[0];
      }
      if (!assetTypesData.includes(selectedAssetType)) {
        selectedAssetType = assetTypesData[0];
      }
    } catch (error) {
      console.error("Failed to load options:", error);
      alert("Failed to load options");
    }
  }

  // 当选择链或资产类型变化时，重新加载代币列表
  async function updateTokensList() {
    try {
      const tokensData = await api.getTokens({
        chain: selectedChain,
        asset_type: selectedAssetType,
      });

      // 确保 tokensData 是数组
      if (Array.isArray(tokensData)) {
        tokens = select_option(["", ...tokensData]);

        // 如果当前选择的代币不在新的列表中，重置选择
        if (selectedToken && !tokensData.includes(selectedToken)) {
          selectedToken = "";
        }
      } else {
        console.error("Tokens data is not an array:", tokensData);
        tokens = [];
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
      tokens = [];
    }
  }

  $effect(() => {
    if (selectedChain || selectedAssetType) {
      updateTokensList();
    }
  });

  onMount(async () => {
    await loadOptions();
    await handleSubmit();
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
      page: currentPage,
      page_size: itemsPerPage,
    };

    try {
      loading = true;
      const response = await api.getYield(query);
      console.log("API Response:", response); // 添加日志
      data = response.data || [];
      totalPages = response.total_pages || 1;
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data");
      data = [];
      totalPages = 1;
    } finally {
      loading = false;
    }
  }

  // 处理页面变化
  async function handlePageChange(newPage: number) {
    await goto(`?page=${newPage}`, { keepFocus: true });
    await handleSubmit();
  }

  function exportToPDF() {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(
      [
        "Yield Report",
        `Chain: ${selectedChain}`,
        `Asset Type: ${selectedAssetType}`,
        `Return Type: ${selectedReturnType || "All"}`,
        `Token: ${selectedToken || "All"}`,
        `Date: ${selectedDate}`,
      ],
      14,
      30,
    );

    // Define table headers based on your data structure
    const headers = [
      "Token",
      "APY",
      "TVL (USD)",
      "Price (USD)",
      "Chain",
      "Return Type",
      "24h Volume (USD)",
      "24h Transactions",
    ];

    // Convert data to table format
    const tableData = data.map((row) => [
      row.token,
      `${(row.apy * 100).toFixed(2)}%`,
      row.tvl_usd.toLocaleString(),
      row.price_usd.toLocaleString(),
      row.chain,
      row.return_type,
      row.volume_24h_usd.toLocaleString(),
      row.transactions_24h.toLocaleString(),
    ]);

    // Generate the table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 50,
    });

    // Save the PDF
    doc.save(`yield-report-${selectedDate}.pdf`);
  }

  function exportToExcel() {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet format
    const wsData = [
      // Headers
      [
        "Token",
        "APY",
        "TVL (USD)",
        "Price (USD)",
        "Chain",
        "Return Type",
        "24h Volume (USD)",
        "24h Transactions",
      ],
      // Data rows
      ...data.map((row) => [
        row.token,
        `${(row.apy * 100).toFixed(2)}%`,
        row.tvl_usd.toLocaleString(),
        row.price_usd.toLocaleString(),
        row.chain,
        row.return_type,
        row.volume_24h_usd.toLocaleString(),
        row.transactions_24h.toLocaleString(),
      ]),
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Token
      { wch: 10 }, // APY
      { wch: 15 }, // TVL
      { wch: 15 }, // Price
      { wch: 15 }, // Chain
      { wch: 15 }, // Return Type
      { wch: 15 }, // Volume
      { wch: 15 }, // Transactions
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Yield Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `yield-report-${selectedDate}.xlsx`);
  }
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-3" size="none">
    <form onsubmit={handleSubmit} class="grid gap-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- 第一行 -->
        <div class="flex items-center gap-4">
          <Label class="w-20 whitespace-nowrap">date</Label>
          <input type="date" class="w-full" bind:value={selectedDate} />
        </div>
        <div class="flex items-center gap-4">
          <Label class="w-20 whitespace-nowrap">chain</Label>
          <Select class="w-full" items={chains} bind:value={selectedChain} />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 第二行 -->
        <div class="flex items-center gap-4">
          <Label class="w-20 whitespace-nowrap">asset type</Label>
          <Select
            class="w-full"
            items={assetTypes}
            bind:value={selectedAssetType}
          />
        </div>
        <div class="flex items-center gap-4">
          <Label class="w-20 whitespace-nowrap">token</Label>
          <Select class="w-full" items={tokens} bind:value={selectedToken} />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 第三行 -->
        <div class="flex items-center gap-4">
          <Label class="w-20 whitespace-nowrap">return type</Label>
          <Select
            class="w-full"
            items={returnTypes}
            bind:value={selectedReturnType}
          />
        </div>
      </div>

      <div class="flex justify-center w-full mt-4">
        <Button type="submit">Query</Button>
      </div>
    </form>
  </Card>

  {#if data.length > 0}
    <Card class="mb-3" size="none">
      <Table shadow>
        <TableHead>
          <TableHeadCell>Token</TableHeadCell>
          <TableHeadCell>APY</TableHeadCell>
          <TableHeadCell>TVL (USD)</TableHeadCell>
          <TableHeadCell>Price (USD)</TableHeadCell>
          <TableHeadCell>Chain</TableHeadCell>
          <TableHeadCell>Return Type</TableHeadCell>
          <TableHeadCell>24h Volume (USD)</TableHeadCell>
          <TableHeadCell>24h Transactions</TableHeadCell>
        </TableHead>
        <TableBody>
          {#if data && data.length > 0}
            {#each data as row}
              <TableBodyRow>
                <TableBodyCell>{row.token}</TableBodyCell>
                <TableBodyCell>{(row.apy * 100).toFixed(2)}%</TableBodyCell>
                <TableBodyCell
                  >{row.tvl_usd?.toLocaleString() || "0"}</TableBodyCell
                >
                <TableBodyCell
                  >{row.price_usd?.toLocaleString() || "0"}</TableBodyCell
                >
                <TableBodyCell>{row.chain}</TableBodyCell>
                <TableBodyCell>{row.return_type}</TableBodyCell>
                <TableBodyCell
                  >{row.volume_24h_usd?.toLocaleString() || "0"}</TableBodyCell
                >
                <TableBodyCell
                  >{row.transactions_24h?.toLocaleString() ||
                    "0"}</TableBodyCell
                >
              </TableBodyRow>
            {/each}
          {:else}
            <TableBodyRow>
              <TableBodyCell colspan="8" class="text-center"
                >No data available</TableBodyCell
              >
            </TableBodyRow>
          {/if}
        </TableBody>
      </Table>

      <div class="flex justify-between items-center mt-4">
        <div class="flex items-center gap-4">
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
            onNext={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))}
          />
        </div>
      </div>
    </Card>
  {/if}
</div>
