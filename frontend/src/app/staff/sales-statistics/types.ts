export type SalesTrendPoint = {
  label: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
};

export type PaymentChannel = {
  name: string;
  revenue: number;
  orders: number;
  color: string;
};

export type CategorySales = {
  name: string;
  revenue: number;
  units: number;
  color: string;
};

export type TopSellingBook = {
  id: string;
  title: string;
  author: string;
  units: number;
  revenue: number;
  growth: number;
};

export type SalesStatistics = {
  periodLabel: string;
  generatedAt: string;
  summary: {
    revenue: number;
    revenueGrowth: number;
    orders: number;
    orderGrowth: number;
    booksSold: number;
    booksSoldGrowth: number;
    averageOrderValue: number;
    averageOrderValueGrowth: number;
  };
  trend: SalesTrendPoint[];
  paymentChannels: PaymentChannel[];
  categories: CategorySales[];
  topSellingBooks: TopSellingBook[];
};

export type SalesPeriod = 'month' | 'quarter' | 'year';

export type SalesPeriodSelection = {
  label: string;
  value: string;
};
