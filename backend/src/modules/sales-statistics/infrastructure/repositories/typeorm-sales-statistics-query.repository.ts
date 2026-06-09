import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OrderTypeOrm } from '../../../order/infrastructure/entities/order.entity';
import { OrderStatus } from '../../../order/domain/order-aggregate/enums/order-status.enum';
import { PaymentStatus } from '../../../order/domain/order-aggregate/enums/payment-status.enum';
import { PaymentMethod } from '../../../order/domain/order-aggregate/enums/payment-method.enum';
import {
  CategorySalesReadModel,
  PaymentChannelReadModel,
  SalesTrendPointReadModel,
  TopSellingBookReadModel,
} from '../../domain/read-models/sales-statistics.read-model';
import {
  ISalesStatisticsQueryRepository,
  SalesPeriodRange,
  SalesSummaryTotals,
} from '../../domain/repositories/sales-statistics-query.repository.interface';

const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.E_WALLET]: 'MoMo',
  [PaymentMethod.CASH_ON_DELIVERY]: 'Cash On Delivery',
};

const paymentMethodColor: Record<PaymentMethod, string> = {
  [PaymentMethod.E_WALLET]: '#2d6a4f',
  [PaymentMethod.CASH_ON_DELIVERY]: '#204877',
};

const categoryColors = [
  '#2d6a4f',
  '#204877',
  '#b45309',
  '#7c3aed',
  '#0f766e',
  '#64748b',
];

@Injectable()
export class TypeOrmSalesStatisticsQueryRepository implements ISalesStatisticsQueryRepository {
  private static readonly TOP_LIMIT = 5;

  public constructor(
    @InjectRepository(OrderTypeOrm)
    private readonly repository: Repository<OrderTypeOrm>,
  ) {}

  public async getSummary(
    range: SalesPeriodRange,
  ): Promise<SalesSummaryTotals> {
    return this.getSummaryBetween(range.start, range.end);
  }

  public async getPreviousSummary(
    range: SalesPeriodRange,
  ): Promise<SalesSummaryTotals> {
    return this.getSummaryBetween(range.previousStart, range.previousEnd);
  }

  public async getTrend(
    range: SalesPeriodRange,
  ): Promise<SalesTrendPointReadModel[]> {
    const labelExpression = this.getTrendLabelExpression(range.period);
    const groupExpression = this.getTrendGroupExpression(range.period);

    const rows = await this.baseSalesQuery()
      .select([
        `${labelExpression} AS label`,
        `${groupExpression} AS sortKey`,
        'SUM(item.quantity * item.price) AS revenue',
        'COUNT(DISTINCT orderEntity.id) AS orders',
      ])
      .andWhere('orderEntity.createdAt >= :start', { start: range.start })
      .andWhere('orderEntity.createdAt < :end', { end: range.end })
      .groupBy('sortKey')
      .addGroupBy('label')
      .orderBy('sortKey', 'ASC')
      .getRawMany<{
        label: string;
        revenue: string | number;
        orders: string | number;
      }>();

    return rows.map((row) => {
      const revenue = Number(row.revenue) || 0;
      const orders = Number(row.orders) || 0;

      return new SalesTrendPointReadModel(
        row.label,
        revenue,
        orders,
        orders > 0 ? Math.round(revenue / orders) : 0,
      );
    });
  }

  public async getPaymentChannels(
    range: SalesPeriodRange,
  ): Promise<PaymentChannelReadModel[]> {
    const rows = await this.baseSalesQuery()
      .select([
        'orderEntity.paymentMethod AS paymentMethod',
        'SUM(item.quantity * item.price) AS revenue',
        'COUNT(DISTINCT orderEntity.id) AS orders',
      ])
      .andWhere('orderEntity.createdAt >= :start', { start: range.start })
      .andWhere('orderEntity.createdAt < :end', { end: range.end })
      .groupBy('orderEntity.paymentMethod')
      .orderBy('revenue', 'DESC')
      .getRawMany<{
        paymentMethod: PaymentMethod;
        revenue: string | number;
        orders: string | number;
      }>();

    return rows.map(
      (row) =>
        new PaymentChannelReadModel(
          paymentMethodLabel[row.paymentMethod] ?? row.paymentMethod,
          Number(row.revenue) || 0,
          Number(row.orders) || 0,
          paymentMethodColor[row.paymentMethod] ?? '#64748b',
        ),
    );
  }

  public async getCategories(
    range: SalesPeriodRange,
  ): Promise<CategorySalesReadModel[]> {
    const rows = await this.baseSalesQuery()
      .innerJoin('item.product', 'book')
      .innerJoin('book.bookGenres', 'bookGenre')
      .innerJoin('bookGenre.genre', 'genre')
      .select([
        'genre.name AS name',
        'SUM(item.quantity * item.price) AS revenue',
        'SUM(item.quantity) AS units',
      ])
      .andWhere('orderEntity.createdAt >= :start', { start: range.start })
      .andWhere('orderEntity.createdAt < :end', { end: range.end })
      .groupBy('genre.id')
      .addGroupBy('genre.name')
      .orderBy('revenue', 'DESC')
      .limit(TypeOrmSalesStatisticsQueryRepository.TOP_LIMIT + 1)
      .getRawMany<{
        name: string;
        revenue: string | number;
        units: string | number;
      }>();

    return rows.map(
      (row, index) =>
        new CategorySalesReadModel(
          row.name,
          Number(row.revenue) || 0,
          Number(row.units) || 0,
          categoryColors[index % categoryColors.length],
        ),
    );
  }

  public async getTopSellingBooks(
    range: SalesPeriodRange,
  ): Promise<TopSellingBookReadModel[]> {
    const rows = await this.baseSalesQuery()
      .innerJoin('item.product', 'book')
      .leftJoin('book.bookAuthors', 'bookAuthor')
      .leftJoin('bookAuthor.author', 'author')
      .select([
        'book.id AS id',
        'book.title AS title',
        `COALESCE(GROUP_CONCAT(DISTINCT author.name ORDER BY author.name SEPARATOR ', '), 'Unknown') AS author`,
        'SUM(item.quantity) AS units',
        'SUM(item.quantity * item.price) AS revenue',
      ])
      .andWhere('orderEntity.createdAt >= :start', { start: range.start })
      .andWhere('orderEntity.createdAt < :end', { end: range.end })
      .groupBy('book.id')
      .addGroupBy('book.title')
      .orderBy('units', 'DESC')
      .addOrderBy('revenue', 'DESC')
      .limit(TypeOrmSalesStatisticsQueryRepository.TOP_LIMIT)
      .getRawMany<{
        id: string;
        title: string;
        author: string;
        units: string | number;
        revenue: string | number;
      }>();

    return rows.map(
      (row) =>
        new TopSellingBookReadModel(
          row.id,
          row.title,
          row.author,
          Number(row.units) || 0,
          Number(row.revenue) || 0,
          0,
        ),
    );
  }

  private async getSummaryBetween(
    start: Date,
    end: Date,
  ): Promise<SalesSummaryTotals> {
    const row = await this.baseSalesQuery()
      .select([
        'SUM(item.quantity * item.price) AS revenue',
        'COUNT(DISTINCT orderEntity.id) AS orders',
        'SUM(item.quantity) AS booksSold',
      ])
      .andWhere('orderEntity.createdAt >= :start', { start })
      .andWhere('orderEntity.createdAt < :end', { end })
      .getRawOne<{
        revenue?: string | number | null;
        orders?: string | number | null;
        booksSold?: string | number | null;
      }>();

    const revenue = Number(row?.revenue) || 0;
    const orders = Number(row?.orders) || 0;

    return {
      revenue,
      orders,
      booksSold: Number(row?.booksSold) || 0,
      averageOrderValue: orders > 0 ? Math.round(revenue / orders) : 0,
    };
  }

  private baseSalesQuery(): SelectQueryBuilder<OrderTypeOrm> {
    return this.repository
      .createQueryBuilder('orderEntity')
      .innerJoin('orderEntity.items', 'item')
      .where('orderEntity.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.CANCELED, OrderStatus.REFUNDED],
      })
      .andWhere('orderEntity.paymentStatus NOT IN (:...excludedPayments)', {
        excludedPayments: [PaymentStatus.FAILED, PaymentStatus.REFUNDED],
      });
  }

  private getTrendLabelExpression(period: SalesPeriodRange['period']): string {
    if (period === 'year') {
      return `DATE_FORMAT(orderEntity.createdAt, '%b')`;
    }

    if (period === 'quarter') {
      return `CONCAT('Week ', WEEK(orderEntity.createdAt, 3) - WEEK(:start, 3) + 1)`;
    }

    return `DATE_FORMAT(orderEntity.createdAt, '%b %d')`;
  }

  private getTrendGroupExpression(period: SalesPeriodRange['period']): string {
    if (period === 'year') {
      return `DATE_FORMAT(orderEntity.createdAt, '%Y-%m')`;
    }

    if (period === 'quarter') {
      return `YEARWEEK(orderEntity.createdAt, 3)`;
    }

    return `DATE(orderEntity.createdAt)`;
  }
}
