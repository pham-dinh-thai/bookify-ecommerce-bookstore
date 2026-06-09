export type SalesPeriod = 'month' | 'quarter' | 'year';

export class SalesTrendPointReadModel {
  public constructor(
    public readonly label: string,
    public readonly revenue: number,
    public readonly orders: number,
    public readonly averageOrderValue: number,
  ) {}
}

export class PaymentChannelReadModel {
  public constructor(
    public readonly name: string,
    public readonly revenue: number,
    public readonly orders: number,
    public readonly color: string,
  ) {}
}

export class CategorySalesReadModel {
  public constructor(
    public readonly name: string,
    public readonly revenue: number,
    public readonly units: number,
    public readonly color: string,
  ) {}
}

export class TopSellingBookReadModel {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly author: string,
    public readonly units: number,
    public readonly revenue: number,
    public readonly growth: number,
  ) {}
}

export class SalesStatisticsReadModel {
  public constructor(
    public readonly periodLabel: string,
    public readonly generatedAt: string,
    public readonly summary: {
      revenue: number;
      revenueGrowth: number;
      orders: number;
      orderGrowth: number;
      booksSold: number;
      booksSoldGrowth: number;
      averageOrderValue: number;
      averageOrderValueGrowth: number;
    },
    public readonly trend: SalesTrendPointReadModel[],
    public readonly paymentChannels: PaymentChannelReadModel[],
    public readonly categories: CategorySalesReadModel[],
    public readonly topSellingBooks: TopSellingBookReadModel[],
  ) {}
}
