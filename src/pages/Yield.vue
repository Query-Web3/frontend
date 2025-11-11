<template>
    <div class="tokens gradient-body">
        <div class="container section-first">
            <div class="flex items-center staking-box !m-0">
                <div class="left flex">
                    <div class="staking-icon flex items-center">
                        <img src="/imgs/staking.svg"></img>
                    </div>
                    <div class="title flex-1">
                        <h1 class="page-title">Yield query</h1>
                        <p>Real-time token yield query function for liquidity providers.</p>
                    </div>
                </div>

                <form class="query-box flex-1 px-2">
                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Token</div>
                        <input id="token" type="text" placeholder="all token"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            &nbsp;Date&nbsp;&nbsp;&nbsp;</div>
                        <input id="date" type="date"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Chain</div>
                        <select id="chain"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500">
                            <option>all chain</option>
                            <option>bifrost</option>
                            <option>hydration </option>
                            <option>stella</option>
                        </select>
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Asset type</div>
                        <select id="asset-type"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500">
                            <option>all type</option>
                            <option>native asset</option>
                            <option>derivative asset</option>
                            <option>RWA</option>
                        </select>
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:t ext-sm/6 dark:text-gray-400">
                            Return type</div>
                        <select id="token"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500">
                            <option>all type</option>
                            <option>staking rewards</option>
                            <option>liquidity mining</option>
                            <option>farms</option>
                        </select>
                    </div>
                </form>
                <button type="submit" class="query">Query</button>
            </div>
        </div>

        <div class="container">
            <div class="flex staking-box bg-transparent items-center">
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-start">Token</div>
                <div class="staking min-w-[70px] flex-1  flex flex justify-center items-center">
                    Yield(yearly)
                </div>
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    Tvl($)
                </div>
                <div class="mstaking min-w-[70px] flex-1 flex flex-col justify-center items-center text-center">
                    Price($)
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    Chain
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    Teturn type
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    24H vol($)
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    24H txns
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    Asset type
                </div>
                <div class="min-w-[70px]  flex-1 flex justify-end items-center">
                    Date
                </div>
            </div>
            <loadingBox class="loader-wrapper" text="Loading..." v-if="loader == 0" />
            <div class="flex staking-box items-center" v-for="(token, _) in tokens">
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-start">{{
                    token.symbol.symbol
                }}
                </div>
                <div class="staking min-w-[70px] flex-1  flex flex justify-center items-center">
                    {{ tvl(token) }}
                </div>
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ numberFormat(token.tvl, 2) }}
                </div>
                <div class="mstaking min-w-[70px] flex-1 flex flex-col justify-center items-center text-center">
                    {{ numberFormat(token.price) }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.chain }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    -
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.vols_24 || "-" }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.vols_24 || "-" }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    <!-- {{ token.asset_type }} --> defi
                </div>
                <div class="min-w-[70px]  flex-1 flex justify-end items-center">
                    {{ dayjs(token.created_at).format('YYYY/MM/DD HH:mm') }}
                </div>
            </div>

            <Pagination :size="size" :page="page" :total="total" @page-change="goto" />
        </div>
        
        <div class="bottom"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import dayjs from 'dayjs'

import loadingBox from "@/components/loading-box.vue";
import Pagination from '@/components/Pagination.vue';
import { Yields } from '@/apis/detail';
import { numberFormat } from '@/utils/format';

const loader = ref(0)
const tokens = ref<Array<any>>([])
const size = ref(10)
const page = ref(1)
const total = ref(0)

onMounted(async () => {
    await initData();
})

onUnmounted(async () => {

})

const initData = async () => {
    // 获取资产信息 
    const tokensFormApi = await Yields({ page: page.value, size: size.value });
    console.log("tokensFormApi:", tokensFormApi);
    tokens.value = tokensFormApi.list;
    loader.value = 1;
    total.value = tokensFormApi.total;
    page.value = tokensFormApi.page;
    size.value = tokensFormApi.size;
}

const goto = async (p: number) => {
    page.value = p;
    loader.value = 0;
    await initData();
}

const tvl = (token: any) => {
    if (token.apy) {
        return `${numberFormat(token.apy, 2)}%`
    } else if (token.farm_apy) {
        return `${numberFormat(token.farm_apy, 2)}%`
    } else if (token.pool_apy) {
        return `${numberFormat(token.pool_apy, 2)}%`
    } else {
        return '-'
    }
}
</script>

<style lang="scss" scoped>
.tokens {
    padding-top: 90px;
    min-height: 100vh;
}

.page-title {
    font-size: 24px !important;
}

.text-split {
    display: inline-block;
    margin: 0 3px;
}

.staking-box {
    padding: 13px 15px;
    margin-bottom: 5px;
    background-color: rgba(33, 33, 33, 0.42);
    font-size: 16px;
    min-width: 800px;

    .left {
        min-width: 305px;
    }

    &.bg-transparent {
        background-color: transparent;
        margin-bottom: 0;
        padding: 20px 20px;
        color: #878787;
    }

    .staking-icon {
        height: 60px;
        padding-left: 0;
        padding-right: 20px;

        img {
            height: 100%;
        }
    }

    .icon {
        margin-left: 7px;
        margin-right: 10px;
        width: 65px;
        height: 65px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .title {
        h1 {
            font-size: 17px;
            font-weight: bold;
        }

        p {
            font-size: 13px;
            line-height: 14px;
            color: rgba($secondary-text-rgb, 0.6);
        }
    }
}

.bottom {
    height: 30px;
    width: 100%;
}

.loader-wrapper {
    font-size: 5.2px;
    height: 80px;
    margin-top: 20px;
}

.query-box {
    display: block;
    margin-bottom: -5px;
    text-align: right;

    .query-item {
        display: inline-flex;
        width: 220px;
        margin-right: 10px;
        margin-bottom: 5px;

        select {
            height: 37px;
        }
    }
}

.query {
    padding: 6px 15px;
    background: $primary-text;
}
</style>