import { env } from "$env/dynamic/public";
import axios from "axios";
import { z } from "zod";

// API 响应类型定义
export interface VolTxnsResponse {
  time: string;
  volume: number;
  yoy: number;
  qoq: number;
  txns: number;
  txns_yoy: number;
  txns_qoq: number;
}

export interface YieldResponse {
  protocol: string;
  chain: Chain;
  asset_type: AssetType;
  return_type: ReturnType;
  token: string;
  apy: number;
  tvl_usd: number;
  price_usd: number;
  volume_24h_usd: number;
  transactions_24h: number;
}

// 查询参数类型定义
export interface VolTxnsQuery {
  from_date: string;
  to_date: string;
  chain: string;
  cycle: string;
}

export type Chain = "Bifrost" | "Hydration" | "stellaswap" | "acala";
export type AssetType = "DeFi" | "Lending" | "Staking";
export type ReturnType = "Staking" | "Farming" | "Lending";

export interface YieldQuery {
  date: string;
  chain?: Chain;
  asset_type?: AssetType;
  return_type?: ReturnType;
  token?: string;
  page?: number;
  page_size?: number;
}

export interface TokensQuery {
  chain?: Chain;
  asset_type?: AssetType;
}

// 分页响应接口
export interface PageResponse<T> {
  data: T[];
  total_pages: number;
  total_items: number;
  current_page: number;
}

// 预定义常量
export const CHAINS = ["Bifrost", "Hydration", "stellaswap", "acala"] as const;
export const ASSET_TYPES = ["DeFi", "Lending", "Staking"] as const;
export const RETURN_TYPES = ["Staking", "Farming", "Lending"] as const;

// 创建axios实例
export const api = axios.create({
  baseURL: `${env.PUBLIC_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// API 封装
export default {
  // 获取交易量数据
  getVolTxns: async (params: VolTxnsQuery): Promise<PageResponse<VolTxnsResponse>> => {
    const response = await api.post("/vol-txns", params);
    return response.data;
  },

  // 获取收益数据
  getYield: async (params: YieldQuery): Promise<PageResponse<YieldResponse>> => {
    const response = await api.post("/yield", params);
    return response.data;
  },

  // 获取链列表
  getChains: async (): Promise<Chain[]> => {
    const response = await api.get("/chains");
    return response.data;
  },

  // 获取资产类型列表
  getAssetTypes: async (): Promise<AssetType[]> => {
    const response = await api.get("/asset-types");
    return response.data;
  },

  // 获取收益类型列表
  getReturnTypes: async (): Promise<ReturnType[]> => {
    const response = await api.get("/return-types");
    return response.data;
  },

  // 获取代币列表
  getTokens: async (params?: TokensQuery): Promise<string[]> => {
    const response = await api.get("/tokens", { params });
    return response.data;
  }
};