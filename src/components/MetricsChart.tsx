"use client";
import { useEffect, useState } from "react";
import { fetchMetrics } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MetricsChart = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchMetrics("hour").then(setMetrics);
  }, []);

  return (
    <LineChart width={600} height={300} data={metrics}>
      <XAxis dataKey="time_bucket" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="avg_value" stroke="#8884d8" />
    </LineChart>
  );
};

export default MetricsChart;
