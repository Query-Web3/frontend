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

  let loading = $state(false);
  let selectedDate = $state(format(new Date(), "yyyy-MM-dd"));
  let selectedChain = $state("Ethereum");
  let selectedAssetType = $state("DeFi");
  let selectedReturnType = $state("");
  let selectedToken = $state("");

  let data: any[] = $state([]);

  const chains = select_option(["Ethereum", "BSC", "Polygon"]);
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
</script>

<div class="max-w-7xl mx-auto">
  <Card class="mb-6" size="none">
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
    <Card size="none">
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
  {/if}
</div>
