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

                <form class="query-box flex-1 px-4">
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
                        <select id="chain" type="text"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Asset type</div>
                        <select id="asset-type" type="text"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Token</div>
                        <select id="token" type="text"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>

                    <div
                        class="query-item flex items-center bg-white pl-2 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 dark:bg-white/5 dark:outline-gray-600 dark:has-[input:focus-within]:outline-indigo-500">
                        <div class="pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                            Return type</div>
                        <select id="token" type="text"
                            class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500" />
                    </div>
                </form>
                <button type="submit" class="query">Query</button>
            </div>
        </div>

        <div class="container">
            <div class="flex staking-box bg-transparent items-center">
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-start">Token</div>
                <div class="staking min-w-[70px] flex-1  flex flex justify-center items-center">
                    Apy
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
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-start">{{ token.token_symbol }}
                </div>
                <div class="staking min-w-[70px] flex-1  flex flex justify-center items-center">
                    Apy
                </div>
                <div class="title min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.tvl }}
                </div>
                <div class="mstaking min-w-[70px] flex-1 flex flex-col justify-center items-center text-center">
                    {{ token.price }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.chain }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    Teturn type
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.vols_24||"-" }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.vols_24||"-" }}
                </div>
                <div class="daily min-w-[70px] flex-1 flex flex-col justify-center items-center">
                    {{ token.asset_type }}
                </div>
                <div class="min-w-[70px]  flex-1 flex justify-end items-center">
                    {{ token.created_at }}
                </div>
            </div>
        </div>

        <div class="bottom"></div>
    </div>
</template>

<script setup lang="ts">
import { getNumstrfromChain, showWTE, showToken } from '@/utils/chain';
import { BN } from '@polkadot/util';
import { onMounted, onUnmounted, ref } from 'vue';

import loadingBox from "@/components/loading-box.vue";
import { getHttpApi } from '@/plugins/chain';
import { Yields } from '@/apis/detail';
const loader = ref(0)
const tokens = ref<Array<any>>([])


onMounted(async () => {
    await initData();
})

onUnmounted(async () => {

})

const initData = async () => {
    // 获取资产信息 
    const tokensFormApi = await Yields({});
    console.log("tokensFormApi:", tokensFormApi);
    tokens.value = tokensFormApi;
    loader.value = 1;
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
    padding: 15px 20px;
    margin-bottom: 20px;
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
        min-width: 200px;
        margin-right: 10px;
        margin-bottom: 5px;

        select {
            height: 37px;
        }
    }
}

.query {
    padding: 10px 15px;
    background: $primary-text;
}
</style>