import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchMetrics = async (interval: string) => {
  const response = await axios.get(`${API_URL}/metrics`, {
    params: { interval },
  });
  return response.data;
};

export const postMetric = async (name: string, value: number) => {
  const response = await axios.post(`${API_URL}/metrics`, { name, value });
  return response.data;
};
