<script lang="ts">
  import api, { CHAINS, ASSET_TYPES, RETURN_TYPES } from "$lib/api";
  import { Button, Card } from "flowbite-svelte";
  import { onMount } from "svelte";

  // 状态变量
  let volTxnsResult = $state<any>(null);
  let yieldResult = $state<any>(null);
  let chainsResult = $state<string[]>([]);
  let assetTypesResult = $state<string[]>([]);
  let returnTypesResult = $state<string[]>([]);
  let tokensResult = $state<string[]>([]);

  // 测试交易量数据接口
  async function testVolTxns() {
    try {
      const result = await api.getVolTxns({
        from_date: "2022-01-01",
        to_date: "2022-01-31",
        chain: "Hydration",
        cycle: "daily"
      });
      volTxnsResult = result;
    } catch (error) {
      volTxnsResult = { error: error.message };
    }
  }

  // 测试收益数据接口
  async function testYield() {
    try {
      const result = await api.getYield({
        date: "2022-01-01",
        chain: "Hydration",
        asset_type: "DeFi",
        page: 1,
        page_size: 10,
        return_type: "Staking"
      });
      yieldResult = result;
    } catch (error) {
      yieldResult = { error: error.message };
    }
  }

  // 测试获取链列表接口
  async function testGetChains() {
    try {
      const result = await api.getChains();
      chainsResult = result;
      console.log("预期的链列表:", CHAINS);
      console.log("实际获取的链列表:", result);
    } catch (error) {
      chainsResult = [`错误: ${error.message}`];
    }
  }

  // 测试获取资产类型列表接口
  async function testGetAssetTypes() {
    try {
      const result = await api.getAssetTypes();
      assetTypesResult = result;
      console.log("预期的资产类型:", ASSET_TYPES);
      console.log("实际获取的资产类型:", result);
    } catch (error) {
      assetTypesResult = [`错误: ${error.message}`];
    }
  }

  // 测试获取收益类型列表接口
  async function testGetReturnTypes() {
    try {
      const result = await api.getReturnTypes();
      returnTypesResult = result;
      console.log("预期的收益类型:", RETURN_TYPES);
      console.log("实际获取的收益类型:", result);
    } catch (error) {
      returnTypesResult = [`错误: ${error.message}`];
    }
  }

  // 测试获取代币列表接口
  async function testGetTokens() {
    try {
      // 测试不同的组合
      const results = await Promise.all([
        // 无参数
        api.getTokens(),
        // 只有chain
        api.getTokens({ chain: "Hydration" }),
        // 只有asset_type
        api.getTokens({ asset_type: "DeFi" }),
        // 两个参数都有
        api.getTokens({ chain: "Hydration", asset_type: "DeFi" })
      ]);
      
      tokensResult = {
        all: results[0],
        byChain: results[1],
        byAssetType: results[2],
        byBoth: results[3]
      };
    } catch (error) {
      tokensResult = { error: error.message };
    }
  }

  // 测试所有接口
  async function testAll() {
    await Promise.all([
      testVolTxns(),
      testYield(),
      testGetChains(),
      testGetAssetTypes(),
      testGetReturnTypes(),
      testGetTokens()
    ]);
  }

  onMount(testAll);
</script>

<div class="max-w-7xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">API 接口测试</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 测试按钮组 -->
    <Card class="mb-4">
      <h2 class="text-xl font-semibold mb-4">测试控制</h2>
      <div class="flex flex-wrap gap-2">
        <Button on:click={testAll}>测试所有接口</Button>
        <Button on:click={testVolTxns}>测试交易量接口</Button>
        <Button on:click={testYield}>测试收益接口</Button>
        <Button on:click={testGetChains}>测试链列表接口</Button>
        <Button on:click={testGetAssetTypes}>测试资产类型接口</Button>
        <Button on:click={testGetReturnTypes}>测试收益类型接口</Button>
        <Button on:click={testGetTokens}>测试代币列表接口</Button>
      </div>
    </Card>

    <!-- 预期值展示 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">预期值</h3>
      <div class="space-y-2">
        <div>
          <strong>链:</strong> {CHAINS.join(", ")}
        </div>
        <div>
          <strong>资产类型:</strong> {ASSET_TYPES.join(", ")}
        </div>
        <div>
          <strong>收益类型:</strong> {RETURN_TYPES.join(", ")}
        </div>
      </div>
    </Card>

    <!-- 交易量数据结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">交易量数据</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(volTxnsResult, null, 2)}
      </pre>
    </Card>

    <!-- 收益数据结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">收益数据</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(yieldResult, null, 2)}
      </pre>
    </Card>

    <!-- 链列表结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">链列表</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(chainsResult, null, 2)}
      </pre>
    </Card>

    <!-- 资产类型列表结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">资产类型列表</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(assetTypesResult, null, 2)}
      </pre>
    </Card>

    <!-- 收益类型列表结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">收益类型列表</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(returnTypesResult, null, 2)}
      </pre>
    </Card>

    <!-- 代币列表结果 -->
    <Card>
      <h3 class="text-lg font-semibold mb-2">代币列表</h3>
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(tokensResult, null, 2)}
      </pre>
    </Card>
  </div>
</div>
