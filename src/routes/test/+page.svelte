<script lang="ts">
    import { api } from "$lib/api";
    import { onMount } from "svelte";

    onMount(() => {
        api.getYield({
            asset_type: "DeFi", // 改为 DeFi、GameFi 或 NFT
            chain: "Polkadot", // 改为 Polkadot、Kusama、Hydration 或 Bifrost
            date: "2022-01-01",
            page: 1,
            page_size: 10,
            return_type: "Staking", // 改为 Staking、Farming 或 Lending，或者删除此字段
            token: "TKN1", // 改为 TKN1-TKN5 中的一个，或者删除此字段
        });
    });
</script>
