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
  Legend,
} from "recharts";
import { Button } from "./ui/button";

const MetricsChart = () => {
  const [metrics, setMetrics] = useState([
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 250, pv: 800, amt: 1010 },
    { name: "Page C", uv: 610, pv: 800, amt: 1010 },
    { name: "Page D", uv: 125, pv: 800, amt: 1010 },
  ]);
  const [interval, setInterval] = useState("hour");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchMetrics(interval);
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchData();
  }, [interval]);

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {["minute", "hour", "day"].map((i) => (
          <Button
            key={i}
            className={`px-4 py-2 rounded ${interval === i ? "bg-blue-500 text-white" : "bg-gray-400"} hover:bg-blue-700`}
            onClick={() => setInterval(i)}
          >
            {i}
          </Button>
        ))}
      </div>

      <LineChart width={800} height={400} data={metrics}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default MetricsChart;
