import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const postMetric = async (
  sales_rep: string,
  amount: number,
  timestamp: string,
) => {
  try {
    const response = await axios.post(`${API_URL}/api/metrics`, {
      sales_rep,
      amount,
      timestamp,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting metric:", error);
    return { success: false };
  }
};

export const fetchIndividualSales = async (interval: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/individual-sales`, {
      params: { interval },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching individual sales:", error);
    return { data: [] };
  }
};

export const fetchMetrics = async (interval: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/metrics`, {
      params: { interval },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { data: [] };
  }
};
