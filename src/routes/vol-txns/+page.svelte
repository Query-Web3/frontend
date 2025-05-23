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
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import { select_option } from "$lib/utils";
  import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-svelte";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  import * as XLSX from "xlsx";
  import { clientApi, type ApiPaths } from "$lib/api";
  import message from "$lib/components/message";

  type VolTxnsResponse = NonNullable<
    ApiPaths["/api/v1/vol-txns"]["post"]["responses"]["200"]["content"]["application/json"]["data"]
  >;

  type VolTxnsQuery = NonNullable<
    ApiPaths["/api/v1/vol-txns"]["post"]["requestBody"]
  >["content"]["application/json"];

  let loading = $state(false);
  let fromDate = $state(format(new Date(), "yyyy-MM-dd"));
  let toDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state("");
  let selectedCycle = $state("daily");
  let data = $state<VolTxnsResponse>([]);

  // 选项数据
  let chains = $state<SelectOptionType<string>[]>([]);
  let cycles = $state<SelectOptionType<string>[]>([]);

  // 分页状态
  let currentPage = $state(1);
  let itemsPerPage = $state(10);

  onMount(async () => {
    await getChainsOptions();
    await getCyclesOptions();
    handleSubmit();
  });

  async function getChainsOptions() {
    const { data } = await clientApi.GET("/api/v1/chains");
    if (data) {
      chains = select_option(["", ...data]);
    }
  }

  async function getCyclesOptions() {
    const { data } = await clientApi.GET("/api/v1/cycles");
    if (data) {
      cycles = select_option(["", ...data]);
    }
  }

  // 格式化数字
  function formatNumber(num: number | undefined | null | string): string {
    if (num === undefined || num === null) return "-";
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(value)) return "-";
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  // 格式化百分比
  function formatPercent(num: number | undefined | null | string): string {
    if (num === undefined || num === null) return "-";
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(value)) return "-";
    return `${value.toFixed(2)}%`;
  }

  // 检查是否为正数
  function isPositive(num: number | undefined | null | string): boolean {
    if (num === undefined || num === null) return false;
    const value = typeof num === "string" ? parseFloat(num) : num;
    return !isNaN(value) && value >= 0;
  }

  async function handleSubmit(e?: Event) {
    e?.preventDefault();

    if (!fromDate || !toDate) {
      message.error("Please select dates");
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
      const response = (
        await clientApi.POST("/api/v1/vol-txns", {
          body: query,
        })
      ).data;

      if (!response) {
        message.error("No data found");
        return;
      }

      console.log("Response data:", response);
      console.log("Response data type:", typeof response);
      console.log("Response data.data:", response.data);

      data = response.data || [];
      console.log("Assigned data:", data);
      // 更新分页信息
      currentPage = response.total || 1;
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch data");
      data = [];
    } finally {
      loading = false;
    }
  }

  // Export functions will be implemented later
  async function exportToPDF() {
    const doc = new jsPDF();
    const title = "Volume & Transactions Report";
    const subtitle = `Chain: ${selectedChain}, Cycle: ${selectedCycle}`;
    const dateRange = `From ${fromDate} to ${toDate}`;
    const exportTime = `Export Time: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;

    // 添加标题
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // 添加子标题
    doc.setFontSize(11);
    doc.text(subtitle, 14, 30);
    doc.text(dateRange, 14, 35);
    doc.text(exportTime, 14, 40);

    // 准备表格数据
    const tableRows = data.map((item) => [
      format(new Date(item.time), "yyyy-MM-dd"),
      formatNumber(item.volume),
      formatPercent(item.yoy),
      formatPercent(item.qoq),
      formatNumber(item.txns),
      formatPercent(item.txns_yoy),
      formatPercent(item.txns_qoq),
    ]);

    // 添加表格
    autoTable(doc, {
      head: [
        [
          "Time",
          "Volume ($)",
          "Volume YoY",
          "Volume QoQ",
          "Txns",
          "Txns YoY",
          "Txns QoQ",
        ],
      ],
      body: tableRows,
      startY: 45,
      theme: "striped",
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },
    });

    // 保存文件
    const fileName = `vol-txns-report-${selectedChain}-${selectedCycle}-${format(new Date(), "yyyyMMdd")}.pdf`;
    doc.save(fileName);
  }

  async function exportToExcel() {
    // 准备表头
    const headers = [
      "Time",
      "Volume ($)",
      "Volume YoY",
      "Volume QoQ",
      "Txns",
      "Txns YoY",
      "Txns QoQ",
    ];

    // 准备数据
    const excelData = data.map((item) => [
      format(new Date(item.time), "yyyy-MM-dd"),
      formatNumber(item.volume).replace(/,/g, ""), // 移除千分位分隔符
      formatPercent(item.yoy).replace("%", ""), // 移除百分号
      formatPercent(item.qoq).replace("%", ""),
      formatNumber(item.txns).replace(/,/g, ""),
      formatPercent(item.txns_yoy).replace("%", ""),
      formatPercent(item.txns_qoq).replace("%", ""),
    ]);

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);

    // 设置列宽
    const colWidths = [
      { wch: 12 }, // Time
      { wch: 15 }, // Volume
      { wch: 12 }, // Volume YoY
      { wch: 12 }, // Volume QoQ
      { wch: 12 }, // Txns
      { wch: 12 }, // Txns YoY
      { wch: 12 }, // Txns QoQ
    ];
    ws["!cols"] = colWidths;

    // 添加报表信息
    const reportInfo = [
      ["Volume & Transactions Report"],
      [`Chain: ${selectedChain}, Cycle: ${selectedCycle}`],
      [`From ${fromDate} to ${toDate}`],
      [`Export Time: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`],
      [], // 空行
    ];

    // 创建新的工作表，包含报表信息
    const finalWs = XLSX.utils.aoa_to_sheet(reportInfo);
    XLSX.utils.sheet_add_aoa(finalWs, [headers, ...excelData], {
      origin: "A6",
    });

    // 设置标题样式
    finalWs["A1"] = {
      t: "s",
      v: "Volume & Transactions Report",
      s: { font: { bold: true, sz: 14 } },
    };

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, finalWs, "Report");

    // 保存文件
    const fileName = `vol-txns-report-${selectedChain}-${selectedCycle}-${format(new Date(), "yyyyMMdd")}.xlsx`;
    XLSX.writeFile(wb, fileName);
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
        <Select id="chain" bind:value={selectedChain} items={chains} placeholder="" />
      </div>

      <div>
        <Label for="cycle" class="mb-2">Cycle</Label>
        <Select id="cycle" bind:value={selectedCycle} items={cycles} placeholder="" />
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
          <TableHeadCell>Chain</TableHeadCell>
          <TableHeadCell>TOKEN</TableHeadCell>
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
              <TableBodyCell
                >{format(new Date(item.time), "yyyy-MM-dd")}</TableBodyCell
              >
              <TableBodyCell>{item.chain || "-"}</TableBodyCell>
              <TableBodyCell>{item.token || "-"}</TableBodyCell>
              <TableBodyCell>{formatNumber(item.volume)}</TableBodyCell>
              <TableBodyCell
                class={isPositive(item.yoy) ? "text-green-600" : "text-red-600"}
              >
                {formatPercent(item.yoy)}
              </TableBodyCell>
              <TableBodyCell
                class={isPositive(item.qoq) ? "text-green-600" : "text-red-600"}
              >
                {formatPercent(item.qoq)}
              </TableBodyCell>
              <TableBodyCell>{formatNumber(item.txns)}</TableBodyCell>
              <TableBodyCell
                class={isPositive(item.txns_yoy)
                  ? "text-green-600"
                  : "text-red-600"}
              >
                {formatPercent(item.txns_yoy)}
              </TableBodyCell>
              <TableBodyCell
                class={isPositive(item.txns_qoq)
                  ? "text-green-600"
                  : "text-red-600"}
              >
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
