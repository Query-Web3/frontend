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
  import { dev } from "$app/environment";

  let loading = $state(false);
  let selectedDate = $state(dev ? "2024-12-08" : format(new Date(), "yyyy-MM-dd"));
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
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const usableWidth = pageWidth - (2 * margin);

    // Set font
    doc.setFont("helvetica");
    doc.setFontSize(14);

    // Add title and query conditions
    const title = [
      "Yield Query Report",
      `Date: ${selectedDate}`,
      `Chain: ${selectedChain}`,
      `Asset Type: ${selectedAssetType}`,
      `Return Type: ${selectedReturnType || "All"}`,
      `Token: ${selectedToken || "All"}`,
    ];

    let yPos = 20;
    title.forEach((line) => {
      doc.text(line, margin, yPos);
      yPos += 7;
    });

    // Calculate column widths as percentages of usable width
    const colWidths = {
      0: usableWidth * 0.15, // Token
      1: usableWidth * 0.08, // APY
      2: usableWidth * 0.15, // TVL
      3: usableWidth * 0.15, // Price
      4: usableWidth * 0.12, // Chain
      5: usableWidth * 0.12, // Return Type
      6: usableWidth * 0.12, // Volume
      7: usableWidth * 0.11, // Txns
    };

    // Format numbers
    const formatNumber = (num: number | undefined | null): string => {
      if (num === undefined || num === null) return "0";
      return num.toLocaleString();
    };

    // Generate table
    autoTable(doc, {
      startY: yPos + 5,
      margin: { left: margin, right: margin },
      head: [[
        "Token",
        "APY",
        "TVL (USD)",
        "Price (USD)",
        "Chain",
        "Return Type",
        "24h Volume",
        "24h Txns",
      ]],
      body: data.map((row) => [
        row.token || "-",
        `${((row.apy || 0) * 100).toFixed(2)}%`,
        formatNumber(row.tvl_usd),
        formatNumber(row.price_usd),
        row.chain || "-",
        row.return_type || "-",
        formatNumber(row.volume_24h_usd),
        formatNumber(row.transactions_24h),
      ]),
      columnStyles: {
        0: { cellWidth: colWidths[0] },
        1: { cellWidth: colWidths[1], halign: "right" },
        2: { cellWidth: colWidths[2], halign: "right" },
        3: { cellWidth: colWidths[3], halign: "right" },
        4: { cellWidth: colWidths[4] },
        5: { cellWidth: colWidths[5] },
        6: { cellWidth: colWidths[6], halign: "right" },
        7: { cellWidth: colWidths[7], halign: "right" },
      },
      styles: {
        fontSize: 9,
        cellPadding: 1,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
      doc.text(
        `Export Time: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
        margin,
        doc.internal.pageSize.height - 10
      );
    }

    // Save file
    doc.save(`yield-report-${selectedDate}.pdf`);
  }

  function exportToExcel() {
    // Format numbers
    const formatNumber = (num: number | undefined | null): string => {
      if (num === undefined || num === null) return "0";
      return num.toLocaleString();
    };

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add title and query info to worksheet
    const title = [
      "Yield Query Report",
      `Date: ${selectedDate}`,
      `Chain: ${selectedChain}`,
      `Asset Type: ${selectedAssetType}`,
      `Return Type: ${selectedReturnType || "All"}`,
      `Token: ${selectedToken || "All"}`,
    ];

    // Data headers
    const headers = [
      "Token",
      "APY",
      "TVL (USD)",
      "Price (USD)",
      "Chain",
      "Return Type",
      "24h Volume",
      "24h Txns",
    ];

    // Convert data to worksheet format
    const wsData = [
      ...title.map(line => [line]),
      [""], // Empty row after title
      headers,
      ...data.map((row) => [
        row.token || "-",
        `${((row.apy || 0) * 100).toFixed(2)}%`,
        formatNumber(row.tvl_usd),
        formatNumber(row.price_usd),
        row.chain || "-",
        row.return_type || "-",
        formatNumber(row.volume_24h_usd),
        formatNumber(row.transactions_24h),
      ]),
      [""], // Empty row before footer
      [`Export Time: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // Token
      { wch: 10 }, // APY
      { wch: 15 }, // TVL
      { wch: 15 }, // Price
      { wch: 15 }, // Chain
      { wch: 15 }, // Return Type
      { wch: 15 }, // Volume
      { wch: 12 }, // Txns
    ];

    // Style cells
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell]) continue;

        // Initialize style if not exists
        if (!ws[cell].s) ws[cell].s = {};

        // Title styles
        if (R < title.length) {
          ws[cell].s.font = { bold: true, sz: 14 };
        }
        // Header styles
        else if (R === title.length + 1) {
          ws[cell].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "428BCA" } },
            alignment: { horizontal: "center" },
          };
        }
        // Data styles
        else if (R > title.length + 1 && R < range.e.r) {
          ws[cell].s.alignment = {
            horizontal: [0, 4, 5].includes(C) ? "left" : "right",
          };
        }
      }
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Yield Data");

    // Save file
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
