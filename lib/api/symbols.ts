import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type SymbolEntry = {
  symbol: string;
  name: string;
  type: 'index' | 'equity';
};

export type SymbolsResponse = {
  symbols: SymbolEntry[];
  metadata: {
    last_fetch_date: string;
    last_fetch_time: string;
    total_symbols?: number;
    fetch_status?: string;
  };
};

export async function fetchSymbols(search?: string): Promise<SymbolsResponse> {
  const params: Record<string, string> = {};
  if (search) {
    params.search = search;
  }
  
  const res = await axios.get(`${API_BASE}/api/symbols/list`, { params });
  return res.data;
}

export async function refreshSymbols(): Promise<{ message: string; metadata: unknown }> {
  const res = await axios.get(`${API_BASE}/api/symbols/refresh`);
  return res.data;
}

export async function fetchSymbolsMetadata(): Promise<{ last_updated: string; total_symbols: number }> {
  const res = await axios.get(`${API_BASE}/api/symbols/metadata`);
  return res.data;
}
