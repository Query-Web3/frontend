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
}

export interface YieldResponse {
  token: string;
  apy: number;
  tvl_usd: number;
  price_usd: number;
  chain: string;
  return_type: string;
  vol_24h_usd: number;
  txns_24h: number;
  asset_type: string;
  date: string;
}

// 查询参数类型定义
export interface VolTxnsQuery {
  from_date: string;
  to_date: string;
  chain: string;
  cycle: string;
}

export interface YieldQuery {
  date: string;
  chain: string;
  asset_type: string;
  return_type?: string;
  token?: string;
  page: number;
  page_size: number;
}

// 分页响应接口
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 创建axios实例
export const api = axios.create({
  baseURL: `${env.PUBLIC_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 预定义的常量
export const CHAINS = ["Polkadot", "Kusama", "Hydration", "Bifrost"] as const;
export const ASSET_TYPES = ["DeFi", "GameFi", "NFT"] as const;
export const RETURN_TYPES = ["Staking", "Farming", "Lending"] as const;

export type Chain = typeof CHAINS[number];
export type AssetType = typeof ASSET_TYPES[number];
export type ReturnType = typeof RETURN_TYPES[number];

// API 封装
export default {
  // 获取交易量数据
  getVolTxns: async (query: VolTxnsQuery): Promise<{ data: VolTxnsResponse[]; total: number }> => {
    const response = await api.post("/vol-txns", query);
    return response.data;
  },

  // 获取收益数据
  getYield: async (query: YieldQuery): Promise<PaginatedResponse<YieldResponse>> => {
    const response = await api.post("/yield", query);
    return response.data;
  },

  // 获取可用的区块链网络列表
  getChains: async (): Promise<string[]> => {
    const response = await api.get("/chains");
    return response.data;
  },

  // 获取可用的资产类型列表
  getAssetTypes: async (): Promise<string[]> => {
    const response = await api.get("/asset-types");
    return response.data;
  },

  // 获取可用的收益类型列表
  getReturnTypes: async (): Promise<string[]> => {
    const response = await api.get("/return-types");
    return response.data;
  },

  // 获取代币列表
  getTokens: async (params?: { chain?: Chain; asset_type?: AssetType }): Promise<string[]> => {
    const response = await api.get("/tokens", { params });
    return response.data;
  }
}