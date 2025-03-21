"use client";
import { useEffect, useState } from "react";
import { fetchMetrics } from "@/services/api";
import { Button } from "./ui/button";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

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
    }));

  /*   scatterData = mockIndividualSales.map((sale) => ({
    x: new Date(sale.timestamp),
    y: sale.amount,
  })); */

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
          displayFormats: {
            hour: "HH:mm", // Format for hours
          },
        },
        min: last24Hours.toISOString(),
        max: now.toISOString(),
        title: { display: true, text: "Time (Last 24h)" },
        ticks: {
          source: "auto" as "auto", // Explicitly cast to the expected type
          autoSkip: false, // Ensures every hour is shown
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sales Amount ($)" },
      },
    },
  };

  /* var options = {
    legend: {
      position: "right",
      labels: {
        boxWidth: 10,
      },
    },
    scales: {
      xAxes: [
        {
          //ticks: { display: false }
        },
      ],
    },
  }; */

  /* const testOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const testData = {
    datasets: [
      {
        label: 'A dataset',
        data: Array.from({ length: 100 }, () => ({
          x: faker.datatype.number({ min: -100, max: 100 }),
          y: faker.datatype.number({ min: -100, max: 100 }),
        })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  }; */

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

        <Scatter options={options} data={chartData} />
      </div>
    </div>
  );
};

export default MetricsChart;
