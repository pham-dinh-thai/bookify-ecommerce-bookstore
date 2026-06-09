import {
  CategorySalesReadModel,
  PaymentChannelReadModel,
  SalesPeriod,
  SalesTrendPointReadModel,
  TopSellingBookReadModel,
} from '../read-models/sales-statistics.read-model';

export type SalesPeriodRange = {
  period: SalesPeriod;
  value: string;
  label: string;
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
};

export type SalesSummaryTotals = {
  revenue: number;
  orders: number;
  booksSold: number;
  averageOrderValue: number;
};

export interface ISalesStatisticsQueryRepository {
  getSummary(range: SalesPeriodRange): Promise<SalesSummaryTotals>;
  getPreviousSummary(range: SalesPeriodRange): Promise<SalesSummaryTotals>;
  getTrend(range: SalesPeriodRange): Promise<SalesTrendPointReadModel[]>;
  getPaymentChannels(
    range: SalesPeriodRange,
  ): Promise<PaymentChannelReadModel[]>;
  getCategories(range: SalesPeriodRange): Promise<CategorySalesReadModel[]>;
  getTopSellingBooks(
    range: SalesPeriodRange,
  ): Promise<TopSellingBookReadModel[]>;
}

export const SALES_STATISTICS_QUERY_REPOSITORY =
  'ISalesStatisticsQueryRepository';
