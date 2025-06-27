import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDefaults(params: {
  instrument?: string;
  live?: boolean;
}) {
  const res = await axios.get(`${API_BASE}/api/greeks/defaults`, {
    params,
  });
  return res.data;
}

export async function fetchMetadata(params: {
  instrument?: string;
  live?: boolean;
  date?: string;
}) {
  const res = await axios.get(`${API_BASE}/api/greeks/metadata`, {
    params,
  });
  return res.data;
}

// export async function fetchMetadata(params: {
//   instrument?: string;
//   expiry?: string;
//   live?: boolean;
// }) {
//   const res = await axios.get(`${API_BASE}/api/greeks/metadata`, {
//     params,
//   });
//   return res.data;
// }

export const fetchGreeksSummary = async ({
  instrument,
  expiry,
  date,
  live
}: {
  instrument: string;
  expiry: string;
  date: string;
  live?: boolean;
}) => {
  const res = await axios.get(`${API_BASE}/api/greeks/summary`, {
    params: { instrument, expiry, date_ist: date, live },
  });
  return res.data;
};
