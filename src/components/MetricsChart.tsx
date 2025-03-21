"use client";
import { useEffect, useState } from "react";
import { fetchMetrics } from "@/services/api";
import { Button } from "./ui/button";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart, Scatter } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
);

type AverageSoldMetric = {
  time_bucket: string;
  sales_rep: string;
  avg_sales: number;
};

type IndividualSale = {
  timestamp: string;
  sales_rep: string;
  amount: number;
};

const mockIndividualSales: IndividualSale[] = [
  { timestamp: "2025-03-21T09:05:00.000Z", sales_rep: "Alice", amount: 1300 },
  { timestamp: "2025-03-21T09:15:00.000Z", sales_rep: "Alice", amount: 1200 },
  { timestamp: "2025-03-21T09:30:00.000Z", sales_rep: "Bob", amount: 2100 },
  { timestamp: "2025-03-21T10:10:00.000Z", sales_rep: "Alice", amount: 3100 },
  { timestamp: "2025-03-21T10:40:00.000Z", sales_rep: "Bob", amount: 2500 },
  { timestamp: "2025-03-21T11:40:00.000Z", sales_rep: "Bob", amount: 1300 },
];

const mockAvgSalesPerHour: AverageSoldMetric[] = [
  {
    time_bucket: "2025-03-19T09:00:00.000Z",
    sales_rep: "Alice",
    avg_sales: 1250,
  },
  {
    time_bucket: "2025-03-19T09:00:00.000Z",
    sales_rep: "Bob",
    avg_sales: 2000,
  },
  {
    time_bucket: "2025-03-19T10:00:00.000Z",
    sales_rep: "Alice",
    avg_sales: 3000,
  },
  {
    time_bucket: "2025-03-19T10:00:00.000Z",
    sales_rep: "Bob",
    avg_sales: 2500,
  },
];

const MetricsChart = () => {
  const [metrics, setMetrics] = useState<AverageSoldMetric[]>([]);
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

    /* fetchData(); */
  }, [interval]);

  const labels = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - (23 - i));
    date.setMinutes(0, 0, 0); // Reset minutes and seconds
    return date;
  });

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const scatterData = mockIndividualSales
    .filter((sale) => new Date(sale.timestamp) >= last24Hours)
    .map((sale) => ({
      x: new Date(sale.timestamp).getTime(),
      y: sale.amount,
      salesRep: sale.sales_rep,
    }));

  const chartData: ChartData<"scatter"> = {
    labels: labels,
    datasets: [
      {
        type: "scatter" as const,
        label: "Individual Sales",
        data: scatterData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as "hour",
          stepSize: 1,
          displayFormats: {
            hour: "HH:mm",
          },
        },
        min: last24Hours.getTime(),
        max: now.getTime(),
        title: { display: true, text: "Time (Last 24h)" },
        ticks: {
          source: "auto" as "auto",
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sales Amount (€)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataPoint = tooltipItem.raw as {
              x: number;
              y: number;
              salesRep?: string;
            };
            return `Sales Rep: ${dataPoint.salesRep ?? "Unknown"},\nAmount: $${dataPoint.y},\nat ${new Date(dataPoint.x).toLocaleTimeString()}`;
          },
        },
      },
    },
  };

  const placeholderData = [{ time_bucket: "No Data", avg_value: 0 }];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sales per {interval}</h2>

      <div>
        <div className="flex space-x-4 mb-4">
          {["minute", "hour", "day"].map((i) => (
            <Button
              key={i}
              className={`px-4 py-2 rounded ${interval === i ? "bg-blue-700 text-white" : "bg-gray-400"} hover:bg-blue-500`}
              onClick={() => setInterval(i)}
            >
              {i}
            </Button>
          ))}
        </div>

        <Chart type="scatter" options={options} data={chartData} />
      </div>
    </div>
  );
};

export default MetricsChart;
