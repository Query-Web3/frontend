import { env } from "$env/dynamic/public";
import axios from "axios";

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

// Mock data generators for development
function generateMockVolTxnsData(query: VolTxnsQuery) {
  const data = [];
  const startDate = new Date(query.from_date);
  const endDate = new Date(query.to_date);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    data.push({
      time: date.toISOString(),
      volume: Math.random() * 1000000,
      yoy: Math.random() * 20 - 10,
      qoq: Math.random() * 15 - 7,
      txns: Math.floor(Math.random() * 100000),
      txns_yoy: Math.random() * 30 - 15,
    });
  }
  return data;
}

function generateMockYieldData(query: YieldQuery) {
  return Array.from({ length: 10 }, () => ({
    token: ["ETH", "USDT", "USDC", "DAI"][Math.floor(Math.random() * 4)],
    apy: Math.random() * 20,
    tvl_usd: Math.random() * 1000000,
    price_usd: Math.random() * 1000,
    chain: query.chain,
    return_type:
      query.return_type ||
      ["Staking", "Farming", "Lending"][Math.floor(Math.random() * 3)],
    vol_24h_usd: Math.random() * 100000,
    txns_24h: Math.floor(Math.random() * 5000),
    asset_type: query.asset_type,
    date: query.date,
  }));
}

export const getVolTxns = async (query: VolTxnsQuery) => {
  try {
    const response = await api.post("/vol-txns/", query);
    return response.data;
  } catch (error) {
    console.log("Using mock data for development");
    return { data: generateMockVolTxnsData(query) };
  }
};

export const getYield = async (query: YieldQuery) => {
  try {
    const response = await api.post("/yield/", query);
    return response.data;
  } catch (error) {
    console.log("Using mock data for development");
    return { data: generateMockYieldData(query) };
  }
};
