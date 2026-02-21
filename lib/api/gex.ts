import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type AvailableTimestampsResponse = {
  timestamps: string[];
  latest_timestamp: string | null;
};

export type GexDataPoint = {
  id: string;
  timestamp: string;
  ist_minute: string;
  instrument: string;
  expiry: string;
  underlying_price: number | null;
  strike: number;
  call_delta: number | null;
  call_theta: number | null;
  call_gamma: number | null;
  call_vega: number | null;
  call_iv: number | null;
  call_oi: number | null;
  call_volume: number | null;
  call_last_price: number | null;
  put_delta: number | null;
  put_theta: number | null;
  put_gamma: number | null;
  put_vega: number | null;
  put_iv: number | null;
  put_oi: number | null;
  put_volume: number | null;
  put_last_price: number | null;
  call_gex: number | null;
  put_gex: number | null;
  net_gex: number | null;
  abs_gex: number | null;
};

export async function fetchGexDefaults(params: {
  instrument?: string;
  live?: boolean;
}) {
  const res = await axios.get(`${API_BASE}/api/gex/defaults`, {
    params,
  });
  return res.data;
}

export async function fetchGexMetadata(params: {
  instrument?: string;
  live?: boolean;
  date?: string;
}) {
  const res = await axios.get(`${API_BASE}/api/gex/metadata`, {
    params,
  });
  return res.data;
}

export const fetchAvailableTimestamps = async ({
  instrument,
  expiry,
  date,
  live
}: {
  instrument: string;
  expiry: string;
  date: string;
  live?: boolean;
}): Promise<AvailableTimestampsResponse> => {
  const res = await axios.get(`${API_BASE}/api/gex/timestamps`, {
    params: { 
      instrument, 
      expiry, 
      date,
      live 
    },
  });
  return res.data;
};

export const fetchGexData = async ({
  instrument,
  expiry,
  start_time,
  end_time,
  live
}: {
  instrument: string;
  expiry: string;
  start_time: string;
  end_time: string;
  live?: boolean;
}): Promise<GexDataPoint[]> => {
  const res = await axios.get(`${API_BASE}/api/gex/data`, {
    params: { instrument, expiry, start_time, end_time, live },
  });
  return res.data;
};
