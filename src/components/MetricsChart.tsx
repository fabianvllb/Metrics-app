"use client";
import { useEffect, useState } from "react";
import { fetchIndividualSales, fetchMetrics } from "@/services/api";
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
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart, Line } from "react-chartjs-2";
import { AverageSoldMetric, IndividualSale } from "@/types/types";
import { useMetricsData } from "@/context/MetricsContext";
import { set } from "react-hook-form";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
);

/* const mockIndividualSales: IndividualSale[] = [
  { timestamp: "2025-03-22T09:05:00.000Z", sales_rep: "Alice", amount: 1300 },
  { timestamp: "2025-03-22T09:15:00.000Z", sales_rep: "Alice", amount: 1200 },
  { timestamp: "2025-03-22T09:30:00.000Z", sales_rep: "Bob", amount: 2100 },
  { timestamp: "2025-03-22T10:10:00.000Z", sales_rep: "Alice", amount: 3100 },
  { timestamp: "2025-03-22T10:40:00.000Z", sales_rep: "Bob", amount: 2500 },
  { timestamp: "2025-03-22T11:40:00.000Z", sales_rep: "Bob", amount: 1300 },
]; */

/* const mockAvgSalesPerMinute: AverageSoldMetric[] = [
  { time_bucket: "2025-03-22T09:05:00.000Z", avg_sales: 1250 },
  { time_bucket: "2025-03-22T09:10:00.000Z", avg_sales: 1450 },
  { time_bucket: "2025-03-22T09:15:00.000Z", avg_sales: 1350 },
];

const mockAvgSalesPerHour: AverageSoldMetric[] = [
  { time_bucket: "2025-03-22T09:00:00.000Z", avg_sales: 1533 },
  { time_bucket: "2025-03-22T10:00:00.000Z", avg_sales: 2800 },
  { time_bucket: "2025-03-22T11:00:00.000Z", avg_sales: 1300 },
];

const mockAvgSalesPerDay: AverageSoldMetric[] = [
  { time_bucket: "2025-03-21T00:00:00.000Z", avg_sales: 1800 },
  { time_bucket: "2025-03-22T00:00:00.000Z", avg_sales: 2400 },
  { time_bucket: "2025-03-23T00:00:00.000Z", avg_sales: 2000 },
]; */

const intervalDurations: Record<string, number> = {
  minute: 60 * 60 * 1000, // 1 hour in milliseconds
  hour: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  day: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const MetricsChart = () => {
  const [interval, setInterval] = useState("hour");
  const [loading, setLoading] = useState(true);
  const {
    sales,
    setSales,
    avgSalesPerMinute,
    setAvgSalesPerMinute,
    avgSalesPerHour,
    setAvgSalesPerHour,
    avgSalesPerDay,
    setAvgSalesPerDay,
  }: {
    sales: IndividualSale[];
    setSales: React.Dispatch<React.SetStateAction<IndividualSale[]>>;
    avgSalesPerMinute: AverageSoldMetric[];
    setAvgSalesPerMinute: React.Dispatch<
      React.SetStateAction<AverageSoldMetric[]>
    >;
    avgSalesPerHour: AverageSoldMetric[];
    setAvgSalesPerHour: React.Dispatch<
      React.SetStateAction<AverageSoldMetric[]>
    >;
    avgSalesPerDay: AverageSoldMetric[];
    setAvgSalesPerDay: React.Dispatch<
      React.SetStateAction<AverageSoldMetric[]>
    >;
  } = useMetricsData();

  // prettier-ignore
  const intervalMapping: Record<string, () => Promise<AverageSoldMetric[]>> = {
    minute: () => fetchMetrics("minute"),
    hour: () => fetchMetrics("hour"),
    day: () => fetchMetrics("day"),
  };

  // prettier-ignore
  const setMapping: Record<string, React.Dispatch<React.SetStateAction<AverageSoldMetric[]>>> = {
    minute: setAvgSalesPerMinute,
    hour: setAvgSalesPerHour,
    day: setAvgSalesPerDay,
  };

  const [scatterData, setScatterData] = useState<
    ChartData<"scatter">["datasets"][0]["data"]
  >([]);

  const [lineData, setLineData] = useState<
    ChartData<"line">["datasets"][0]["data"]
  >([]);

  // Fetch data at initial render and when interval changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // We fetch individual sales data
        const individualSalesData: IndividualSale[] =
          await fetchIndividualSales(interval);

        console.log("individualSalesData", individualSalesData);
        setSales(individualSalesData);

        // We fetch average sales data according to the interval
        // prettier-ignore
        if (intervalMapping[interval] && setMapping[interval]) {
          const data = await intervalMapping[interval]();
          console.log(`${interval}Data`, data);
          setMapping[interval](data);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interval]);

  useEffect(() => {
    console.log("lineData", lineData);
  }, [lineData]);

  // Update chart scatterplot data when sales data changes
  useEffect(() => {
    const scatterData = sales.map((sale) => ({
      x: sale.timestamp ? new Date(sale.timestamp).getTime() : 0,
      y: sale.amount,
      salesRep: sale.sales_rep,
    }));

    setScatterData(scatterData);
  }, [sales]);

  // Update chart lineplot data when average sales data changes
  useEffect(() => {
    const avgSalesData =
      interval === "minute"
        ? avgSalesPerMinute || []
        : interval === "hour"
          ? avgSalesPerHour || []
          : avgSalesPerDay || [];

    console.log(
      "--avgSaleTime",
      avgSalesData.map((entry) => new Date(entry.time_bucket).toString()),
    );

    const tmpData = avgSalesData.map((entry) => ({
      x: new Date(entry.time_bucket).getTime(),
      y: entry.avg_sales,
    }));

    setLineData(tmpData);
  }, [avgSalesPerMinute, avgSalesPerHour, avgSalesPerDay]);

  /* const labels = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - (23 - i));
    date.setMinutes(0, 0, 0); // Reset minutes and seconds
    return date;
  }); */

  const now = new Date();
  let lastPeriod = new Date(now.getTime() - intervalDurations[interval]);

  const chartData: ChartData<"line" | "scatter"> = {
    /* labels: labels, */
    datasets: [
      {
        type: "scatter" as const,
        label: "Individual Sales",
        data: scatterData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointRadius: 3,
      },
      {
        type: "line" as const,
        label: "Average Sales per Hour",
        data: lineData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineChartData: ChartData<"line"> = {
    datasets: [
      {
        type: "line" as const,
        label: "Average Sales per Hour",
        data: lineData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: interval as "minute" | "hour" | "day",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "MMM dd",
          },
        },
        min: lastPeriod.getTime(),
        max: now.getTime(),
        title: { display: true, text: `Time (${interval})` },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sales Amount (€)" },
      },
    },
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 10,
        },
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  const options: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: interval as "minute" | "hour" | "day",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "MMM dd",
          },
        },
        min: lastPeriod.getTime(),
        max: now.getTime(),
        title: { display: true, text: `Time (${interval})` },
        /* ticks: {
          source: "auto" as "auto",
          autoSkip: false,
        }, */
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sales Amount (€)" },
      },
    },
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const datasetIndex = tooltipItem.datasetIndex;
            const dataPoint = tooltipItem.raw as {
              x: number;
              y: number;
              salesRep?: string;
            };

            if (datasetIndex === 0) {
              return `Sales Rep: ${dataPoint.salesRep ?? "Unknown"},\nAmount: €${dataPoint.y},\nat ${new Date(dataPoint.x).toLocaleTimeString()}`;
            } else {
              return `Avg Sales: €${dataPoint.y}\nat ${new Date(dataPoint.x).toLocaleTimeString()}`;
            }
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
        <div className="flex space-x-2  mb-4">
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

        <Chart type="line" options={options} data={chartData} />
        {/* <Line options={lineOptions} data={lineChartData} /> */}
      </div>
    </div>
  );
};

export default MetricsChart;
