"use client";
import { AverageSoldMetric, IndividualSale } from "@/types/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Create the context
const MetricsContext = createContext<any>(null);

// Create a provider component
// prettier-ignore
export const MetricsDataProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState<IndividualSale[]>([]);

  const [avgSalesPerMinute, setAvgSalesPerMinute] = useState<AverageSoldMetric[]>([]);
  const [avgSalesPerHour, setAvgSalesPerHour] = useState<AverageSoldMetric[]>([]);
  const [avgSalesPerDay, setAvgSalesPerDay] = useState<AverageSoldMetric[]>([]);

  return (
    <MetricsContext.Provider value={{ sales, setSales, avgSalesPerMinute, setAvgSalesPerMinute, avgSalesPerHour, setAvgSalesPerHour, avgSalesPerDay, setAvgSalesPerDay }}>
      {children}
    </MetricsContext.Provider>
  );
};

// Custom hook to use the context easily in other components
export const useMetricsData = () => useContext(MetricsContext);
