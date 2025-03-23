export type AverageSoldMetric = {
  time_bucket: string;
  avg_sales: number;
};

export type IndividualSale = {
  timestamp: string;
  sales_rep: string;
  amount: number;
};
