import { env } from "$env/dynamic/public";
import axios from "axios";
import { z } from "zod";

export const api = axios.create({
  baseURL: env.PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

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
}


export default {
  getVolTxns: async (query: VolTxnsQuery) => {
    const response = await api.post("/vol-txns/", query);
    return response.data;
  },
  getYield: async (query: YieldQuery) => {
    const response = await api.post("/yield/", query);
    return response.data;
  }
}