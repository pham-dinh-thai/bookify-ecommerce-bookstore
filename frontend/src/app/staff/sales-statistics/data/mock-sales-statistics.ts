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

export const mockSalesStatistics: SalesStatistics = {
  periodLabel: 'Last 30 days',
  generatedAt: '2026-06-09T09:30:00.000Z',
  summary: {
    revenue: 186450000,
    revenueGrowth: 12.4,
    orders: 1284,
    orderGrowth: 8.7,
    booksSold: 3942,
    booksSoldGrowth: 15.1,
    averageOrderValue: 145200,
    averageOrderValueGrowth: 3.6,
  },
  trend: [
    {
      label: 'May 11',
      revenue: 4200000,
      orders: 31,
      averageOrderValue: 135500,
    },
    {
      label: 'May 12',
      revenue: 5100000,
      orders: 36,
      averageOrderValue: 141700,
    },
    {
      label: 'May 13',
      revenue: 4700000,
      orders: 34,
      averageOrderValue: 138200,
    },
    {
      label: 'May 14',
      revenue: 6200000,
      orders: 42,
      averageOrderValue: 147600,
    },
    {
      label: 'May 15',
      revenue: 5900000,
      orders: 39,
      averageOrderValue: 151300,
    },
    {
      label: 'May 16',
      revenue: 7600000,
      orders: 51,
      averageOrderValue: 149000,
    },
    {
      label: 'May 17',
      revenue: 8200000,
      orders: 58,
      averageOrderValue: 141400,
    },
    {
      label: 'May 18',
      revenue: 6900000,
      orders: 45,
      averageOrderValue: 153300,
    },
    {
      label: 'May 19',
      revenue: 7200000,
      orders: 48,
      averageOrderValue: 150000,
    },
    {
      label: 'May 20',
      revenue: 6500000,
      orders: 43,
      averageOrderValue: 151200,
    },
    {
      label: 'May 21',
      revenue: 8800000,
      orders: 61,
      averageOrderValue: 144300,
    },
    {
      label: 'May 22',
      revenue: 9300000,
      orders: 64,
      averageOrderValue: 145300,
    },
    {
      label: 'May 23',
      revenue: 10100000,
      orders: 68,
      averageOrderValue: 148500,
    },
    {
      label: 'May 24',
      revenue: 9700000,
      orders: 63,
      averageOrderValue: 154000,
    },
    {
      label: 'May 25',
      revenue: 11300000,
      orders: 76,
      averageOrderValue: 148700,
    },
    {
      label: 'May 26',
      revenue: 10800000,
      orders: 71,
      averageOrderValue: 152100,
    },
    {
      label: 'May 27',
      revenue: 11900000,
      orders: 82,
      averageOrderValue: 145100,
    },
    {
      label: 'May 28',
      revenue: 12700000,
      orders: 86,
      averageOrderValue: 147700,
    },
  ],
  paymentChannels: [
    { name: 'MoMo', revenue: 89620000, orders: 598, color: '#2d6a4f' },
    {
      name: 'Cash On Delivery',
      revenue: 71340000,
      orders: 516,
      color: '#204877',
    },
    { name: 'Bank Transfer', revenue: 25490000, orders: 170, color: '#b45309' },
  ],
  categories: [
    { name: 'Business', revenue: 43600000, units: 824, color: '#2d6a4f' },
    { name: 'Literature', revenue: 38900000, units: 936, color: '#204877' },
    { name: 'Self-help', revenue: 34700000, units: 742, color: '#b45309' },
    { name: 'Children', revenue: 28600000, units: 688, color: '#7c3aed' },
    { name: 'Technology', revenue: 21400000, units: 398, color: '#0f766e' },
    { name: 'Others', revenue: 19250000, units: 354, color: '#64748b' },
  ],
  topSellingBooks: [
    {
      id: 'book-001',
      title: 'Atomic Habits',
      author: 'James Clear',
      units: 286,
      revenue: 37180000,
      growth: 18.4,
    },
    {
      id: 'book-002',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      units: 241,
      revenue: 33740000,
      growth: 11.2,
    },
    {
      id: 'book-003',
      title: 'Dune',
      author: 'Frank Herbert',
      units: 205,
      revenue: 30750000,
      growth: 9.6,
    },
    {
      id: 'book-004',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      units: 174,
      revenue: 29580000,
      growth: 14.9,
    },
    {
      id: 'book-005',
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupery',
      units: 319,
      revenue: 25520000,
      growth: 7.8,
    },
  ],
};

const scalePaymentChannels = (
  channels: PaymentChannel[],
  multiplier: number,
): PaymentChannel[] =>
  channels.map((channel) => ({
    ...channel,
    revenue: Math.round(channel.revenue * multiplier),
    orders: Math.round(channel.orders * multiplier),
  }));

const scaleCategories = (
  categories: CategorySales[],
  multiplier: number,
): CategorySales[] =>
  categories.map((category) => ({
    ...category,
    revenue: Math.round(category.revenue * multiplier),
    units: Math.round(category.units * multiplier),
  }));

const scaleTopBooks = (
  books: TopSellingBook[],
  multiplier: number,
  growthOffset: number,
): TopSellingBook[] =>
  books.map((book) => ({
    ...book,
    units: Math.round(book.units * multiplier),
    revenue: Math.round(book.revenue * multiplier),
    growth: Number((book.growth + growthOffset).toFixed(1)),
  }));

const adjustStatistics = (
  statistics: SalesStatistics,
  {
    periodLabel,
    multiplier,
    growthOffset,
    trendLabelMonth,
  }: {
    periodLabel: string;
    multiplier: number;
    growthOffset: number;
    trendLabelMonth?: string;
  },
): SalesStatistics => ({
  ...statistics,
  periodLabel,
  summary: {
    revenue: Math.round(statistics.summary.revenue * multiplier),
    revenueGrowth: Number(
      (statistics.summary.revenueGrowth + growthOffset).toFixed(1),
    ),
    orders: Math.round(statistics.summary.orders * multiplier),
    orderGrowth: Number(
      (statistics.summary.orderGrowth + growthOffset).toFixed(1),
    ),
    booksSold: Math.round(statistics.summary.booksSold * multiplier),
    booksSoldGrowth: Number(
      (statistics.summary.booksSoldGrowth + growthOffset).toFixed(1),
    ),
    averageOrderValue: Math.round(
      statistics.summary.averageOrderValue * (0.98 + multiplier * 0.02),
    ),
    averageOrderValueGrowth: Number(
      (statistics.summary.averageOrderValueGrowth + growthOffset / 2).toFixed(
        1,
      ),
    ),
  },
  trend: statistics.trend.map((point) => ({
    label: trendLabelMonth
      ? point.label.replace(/^[A-Za-z]+/, trendLabelMonth)
      : point.label,
    revenue: Math.round(point.revenue * multiplier),
    orders: Math.round(point.orders * multiplier),
    averageOrderValue: Math.round(point.averageOrderValue * multiplier),
  })),
  paymentChannels: scalePaymentChannels(statistics.paymentChannels, multiplier),
  categories: scaleCategories(statistics.categories, multiplier),
  topSellingBooks: scaleTopBooks(
    statistics.topSellingBooks,
    multiplier,
    growthOffset,
  ),
});

export const mockSalesStatisticsByPeriod: Record<SalesPeriod, SalesStatistics> =
  {
    month: mockSalesStatistics,
    quarter: {
      ...mockSalesStatistics,
      periodLabel: 'Current quarter',
      summary: {
        revenue: 548920000,
        revenueGrowth: 16.8,
        orders: 3826,
        orderGrowth: 10.5,
        booksSold: 11874,
        booksSoldGrowth: 17.2,
        averageOrderValue: 143470,
        averageOrderValueGrowth: 5.1,
      },
      trend: [
        {
          label: 'Week 1',
          revenue: 41200000,
          orders: 288,
          averageOrderValue: 143100,
        },
        {
          label: 'Week 2',
          revenue: 39800000,
          orders: 276,
          averageOrderValue: 144200,
        },
        {
          label: 'Week 3',
          revenue: 43500000,
          orders: 301,
          averageOrderValue: 144500,
        },
        {
          label: 'Week 4',
          revenue: 46100000,
          orders: 319,
          averageOrderValue: 144500,
        },
        {
          label: 'Week 5',
          revenue: 48900000,
          orders: 337,
          averageOrderValue: 145100,
        },
        {
          label: 'Week 6',
          revenue: 50200000,
          orders: 349,
          averageOrderValue: 143800,
        },
        {
          label: 'Week 7',
          revenue: 52300000,
          orders: 362,
          averageOrderValue: 144500,
        },
        {
          label: 'Week 8',
          revenue: 48100000,
          orders: 334,
          averageOrderValue: 144000,
        },
        {
          label: 'Week 9',
          revenue: 53600000,
          orders: 371,
          averageOrderValue: 144500,
        },
        {
          label: 'Week 10',
          revenue: 55700000,
          orders: 389,
          averageOrderValue: 143200,
        },
        {
          label: 'Week 11',
          revenue: 58400000,
          orders: 407,
          averageOrderValue: 143500,
        },
        {
          label: 'Week 12',
          revenue: 61200000,
          orders: 425,
          averageOrderValue: 144000,
        },
      ],
      paymentChannels: scalePaymentChannels(
        mockSalesStatistics.paymentChannels,
        2.95,
      ),
      categories: scaleCategories(mockSalesStatistics.categories, 2.94),
      topSellingBooks: scaleTopBooks(
        mockSalesStatistics.topSellingBooks,
        3.05,
        2.6,
      ),
    },
    year: {
      ...mockSalesStatistics,
      periodLabel: 'Current year',
      summary: {
        revenue: 2148750000,
        revenueGrowth: 22.9,
        orders: 15142,
        orderGrowth: 18.6,
        booksSold: 46280,
        booksSoldGrowth: 24.3,
        averageOrderValue: 141910,
        averageOrderValueGrowth: 4.7,
      },
      trend: [
        {
          label: 'Jan',
          revenue: 132400000,
          orders: 962,
          averageOrderValue: 137600,
        },
        {
          label: 'Feb',
          revenue: 148700000,
          orders: 1056,
          averageOrderValue: 140800,
        },
        {
          label: 'Mar',
          revenue: 159300000,
          orders: 1118,
          averageOrderValue: 142500,
        },
        {
          label: 'Apr',
          revenue: 171600000,
          orders: 1194,
          averageOrderValue: 143700,
        },
        {
          label: 'May',
          revenue: 186450000,
          orders: 1284,
          averageOrderValue: 145200,
        },
        {
          label: 'Jun',
          revenue: 194800000,
          orders: 1362,
          averageOrderValue: 143000,
        },
        {
          label: 'Jul',
          revenue: 181900000,
          orders: 1296,
          averageOrderValue: 140400,
        },
        {
          label: 'Aug',
          revenue: 203500000,
          orders: 1438,
          averageOrderValue: 141500,
        },
        {
          label: 'Sep',
          revenue: 216700000,
          orders: 1515,
          averageOrderValue: 143000,
        },
        {
          label: 'Oct',
          revenue: 224200000,
          orders: 1586,
          averageOrderValue: 141400,
        },
        {
          label: 'Nov',
          revenue: 236800000,
          orders: 1664,
          averageOrderValue: 142300,
        },
        {
          label: 'Dec',
          revenue: 292400000,
          orders: 1967,
          averageOrderValue: 148700,
        },
      ],
      paymentChannels: scalePaymentChannels(
        mockSalesStatistics.paymentChannels,
        11.52,
      ),
      categories: scaleCategories(mockSalesStatistics.categories, 11.45),
      topSellingBooks: scaleTopBooks(
        mockSalesStatistics.topSellingBooks,
        11.75,
        6.4,
      ),
    },
  };

export const salesPeriodOptions: { label: string; value: SalesPeriod }[] = [
  { label: 'Monthly', value: 'month' },
  { label: 'Quarterly', value: 'quarter' },
  { label: 'Yearly', value: 'year' },
];

export const salesPeriodSelections: Record<
  SalesPeriod,
  SalesPeriodSelection[]
> = {
  month: [
    { label: 'June 2026', value: '2026-06' },
    { label: 'May 2026', value: '2026-05' },
    { label: 'April 2026', value: '2026-04' },
  ],
  quarter: [
    { label: 'Q2 2026', value: '2026-Q2' },
    { label: 'Q1 2026', value: '2026-Q1' },
    { label: 'Q4 2025', value: '2025-Q4' },
  ],
  year: [
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
  ],
};

export const mockSalesStatisticsBySelection: Record<
  SalesPeriod,
  Record<string, SalesStatistics>
> = {
  month: {
    '2026-06': {
      ...mockSalesStatistics,
      periodLabel: 'June 2026',
      trend: mockSalesStatistics.trend.map((point) => ({
        ...point,
        label: point.label.replace('May', 'Jun'),
      })),
    },
    '2026-05': {
      ...mockSalesStatistics,
      periodLabel: 'May 2026',
    },
    '2026-04': adjustStatistics(mockSalesStatistics, {
      periodLabel: 'April 2026',
      multiplier: 0.86,
      growthOffset: -5.2,
      trendLabelMonth: 'Apr',
    }),
  },
  quarter: {
    '2026-Q2': {
      ...mockSalesStatisticsByPeriod.quarter,
      periodLabel: 'Q2 2026',
    },
    '2026-Q1': adjustStatistics(mockSalesStatisticsByPeriod.quarter, {
      periodLabel: 'Q1 2026',
      multiplier: 0.89,
      growthOffset: -4.8,
    }),
    '2025-Q4': adjustStatistics(mockSalesStatisticsByPeriod.quarter, {
      periodLabel: 'Q4 2025',
      multiplier: 0.78,
      growthOffset: -8.1,
    }),
  },
  year: {
    '2026': {
      ...mockSalesStatisticsByPeriod.year,
      periodLabel: '2026',
    },
    '2025': adjustStatistics(mockSalesStatisticsByPeriod.year, {
      periodLabel: '2025',
      multiplier: 0.82,
      growthOffset: -7.4,
    }),
    '2024': adjustStatistics(mockSalesStatisticsByPeriod.year, {
      periodLabel: '2024',
      multiplier: 0.68,
      growthOffset: -12.6,
    }),
  },
};
