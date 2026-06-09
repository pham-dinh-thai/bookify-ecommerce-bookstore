import { Inject, Injectable } from '@nestjs/common';
import {
  SALES_STATISTICS_QUERY_REPOSITORY,
  SalesPeriodRange,
  type ISalesStatisticsQueryRepository,
} from '../../../domain/repositories/sales-statistics-query.repository.interface';
import {
  SalesPeriod,
  SalesStatisticsReadModel,
} from '../../../domain/read-models/sales-statistics.read-model';

@Injectable()
export class GetSalesStatisticsUseCase {
  public constructor(
    @Inject(SALES_STATISTICS_QUERY_REPOSITORY)
    private readonly salesStatisticsQueryRepository: ISalesStatisticsQueryRepository,
  ) {}

  public async execute(
    period: SalesPeriod = 'month',
    value?: string,
  ): Promise<SalesStatisticsReadModel> {
    const range = this.getRange(period, value);

    const [summary, previousSummary, trend, paymentChannels, categories] =
      await Promise.all([
        this.salesStatisticsQueryRepository.getSummary(range),
        this.salesStatisticsQueryRepository.getPreviousSummary(range),
        this.salesStatisticsQueryRepository.getTrend(range),
        this.salesStatisticsQueryRepository.getPaymentChannels(range),
        this.salesStatisticsQueryRepository.getCategories(range),
      ]);

    const topSellingBooks =
      await this.salesStatisticsQueryRepository.getTopSellingBooks(range);

    return new SalesStatisticsReadModel(
      range.label,
      new Date().toISOString(),
      {
        revenue: summary.revenue,
        revenueGrowth: this.calculateGrowth(
          summary.revenue,
          previousSummary.revenue,
        ),
        orders: summary.orders,
        orderGrowth: this.calculateGrowth(
          summary.orders,
          previousSummary.orders,
        ),
        booksSold: summary.booksSold,
        booksSoldGrowth: this.calculateGrowth(
          summary.booksSold,
          previousSummary.booksSold,
        ),
        averageOrderValue: summary.averageOrderValue,
        averageOrderValueGrowth: this.calculateGrowth(
          summary.averageOrderValue,
          previousSummary.averageOrderValue,
        ),
      },
      trend,
      paymentChannels,
      categories,
      topSellingBooks,
    );
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous <= 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  private getRange(period: SalesPeriod, value?: string): SalesPeriodRange {
    if (period === 'quarter') {
      return this.getQuarterRange(value);
    }

    if (period === 'year') {
      return this.getYearRange(value);
    }

    return this.getMonthRange(value);
  }

  private getMonthRange(value?: string): SalesPeriodRange {
    const now = new Date();
    const match = value?.match(/^(\d{4})-(\d{2})$/);
    const year = match ? Number(match[1]) : now.getUTCFullYear();
    const month = match ? Number(match[2]) - 1 : now.getUTCMonth();

    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 1));
    const previousStart = new Date(Date.UTC(year, month - 1, 1));
    const previousEnd = start;

    return {
      period: 'month',
      value: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(start),
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  private getQuarterRange(value?: string): SalesPeriodRange {
    const now = new Date();
    const match = value?.match(/^(\d{4})-Q([1-4])$/);
    const year = match ? Number(match[1]) : now.getUTCFullYear();
    const quarter = match
      ? Number(match[2])
      : Math.floor(now.getUTCMonth() / 3) + 1;
    const month = (quarter - 1) * 3;

    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 3, 1));
    const previousStart = new Date(Date.UTC(year, month - 3, 1));
    const previousEnd = start;

    return {
      period: 'quarter',
      value: `${year}-Q${quarter}`,
      label: `Q${quarter} ${year}`,
      start,
      end,
      previousStart,
      previousEnd,
    };
  }

  private getYearRange(value?: string): SalesPeriodRange {
    const now = new Date();
    const year = value?.match(/^\d{4}$/) ? Number(value) : now.getUTCFullYear();

    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    const previousStart = new Date(Date.UTC(year - 1, 0, 1));
    const previousEnd = start;

    return {
      period: 'year',
      value: String(year),
      label: String(year),
      start,
      end,
      previousStart,
      previousEnd,
    };
  }
}
