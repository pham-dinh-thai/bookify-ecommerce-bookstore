import { Injectable } from '@nestjs/common';
import { IOrdersQueryRepository } from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderReadModel } from '../../../domain/order-aggregate/read-models/order.read-model';
import { OrderDetailReadModel } from '../../../domain/order-aggregate/read-models/order-detail.read-model';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTypeOrm } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import { MyOrderReadModel } from '../../../domain/order-aggregate/read-models/my-order.read-model';
import { OrdersMapper } from '../../mappers/orders.mapper';
import { OrderNotFoundException } from '../../../domain/order-aggregate/exceptions/order-not-found.exception';
import { OrderStatus } from '../../../domain/order-aggregate/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/order-aggregate/enums/payment-status.enum';
import { PaymentMethod } from '../../../domain/order-aggregate/enums/payment-method.enum';

@Injectable()
export class TypeOrmOrdersQueryRepository implements IOrdersQueryRepository {
  public constructor(
    @InjectRepository(OrderTypeOrm)
    private readonly repository: Repository<OrderTypeOrm>,
  ) {}

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<OrderReadModel[]> {
    const query = this.repository
      .createQueryBuilder('orderEntity')
      .leftJoinAndSelect('orderEntity.items', 'items');

    if (search) {
      query.where(
        `orderEntity.orderCode LIKE :search
        OR orderEntity.status LIKE :search
        OR orderEntity.paymentStatus LIKE :search
        OR orderEntity.paymentMethod LIKE :search`,
        { search: `%${search}%` },
      );
    }

    const ordersTypeOrm: OrderTypeOrm[] = await query
      .orderBy('orderEntity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return ordersTypeOrm.map((orderTypeOrm) =>
      OrdersMapper.toOrderReadModel(orderTypeOrm),
    );
  }

  public async findUserOrders(userId: string): Promise<MyOrderReadModel[]> {
    const ordersTypeOrm: OrderTypeOrm[] = await this.repository.find({
      where: { userId },
      relations: {
        items: {
          product: {
            covers: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return ordersTypeOrm.map((orderTypeOrm) =>
      OrdersMapper.toMyOrderReadModel(orderTypeOrm),
    );
  }

  public async findRecent(limit: number): Promise<OrderReadModel[]> {
    const ordersTypeOrm: OrderTypeOrm[] = await this.repository.find({
      relations: {
        items: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    return ordersTypeOrm.map((orderTypeOrm) =>
      OrdersMapper.toOrderReadModel(orderTypeOrm),
    );
  }

  public async findOne(id: string): Promise<OrderReadModel | null> {
    const orderTypeOrm: OrderTypeOrm | null = await this.repository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });

    if (!orderTypeOrm) {
      return null;
    }

    return OrdersMapper.toOrderReadModel(orderTypeOrm);
  }

  public async findOrderDetailById(
    orderId: string,
  ): Promise<OrderDetailReadModel> {
    const orderTypeOrm: OrderTypeOrm | null = await this.repository.findOne({
      where: { id: orderId },
      relations: {
        user: true,
        items: {
          product: {
            covers: true,
          },
        },
      },
    });

    if (!orderTypeOrm) {
      throw new OrderNotFoundException();
    }

    return OrdersMapper.toOrderDetailReadModel(orderTypeOrm);
  }

  public async findOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderDetailReadModel> {
    const orderTypeOrm: OrderTypeOrm | null = await this.repository.findOne({
      where: { id: orderId, userId },
      relations: {
        user: true,
        items: {
          product: {
            covers: true,
          },
        },
      },
    });

    if (!orderTypeOrm) {
      throw new OrderNotFoundException();
    }

    return OrdersMapper.toOrderDetailReadModel(orderTypeOrm);
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('orderEntity');

    if (search) {
      query.where(
        `orderEntity.orderCode LIKE :search
        OR orderEntity.status LIKE :search
        OR orderEntity.paymentStatus LIKE :search
        OR orderEntity.paymentMethod LIKE :search`,
        { search: `%${search}%` },
      );
    }

    return query.getCount() ?? 0;
  }

  public async countByStatus(status: OrderStatus): Promise<number> {
    return this.repository.countBy({ status });
  }

  public async countByPaymentStatus(
    paymentStatus: PaymentStatus,
  ): Promise<number> {
    return this.repository.countBy({ paymentStatus });
  }

  public async countWorkload(): Promise<{
    pending: number;
    confirmed: number;
    delivering: number;
    unpaidCod: number;
    deliveredUnpaid: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('orderEntity')
      .select([
        `SUM(CASE WHEN orderEntity.status = :pending THEN 1 ELSE 0 END) AS pending`,
        `SUM(CASE WHEN orderEntity.status = :confirmed THEN 1 ELSE 0 END) AS confirmed`,
        `SUM(CASE WHEN orderEntity.status = :delivering THEN 1 ELSE 0 END) AS delivering`,
        `SUM(CASE WHEN orderEntity.paymentMethod = :cashOnDelivery
          AND orderEntity.paymentStatus = :unpaid THEN 1 ELSE 0 END) AS unpaidCod`,
        `SUM(CASE WHEN orderEntity.status = :delivered
          AND orderEntity.paymentStatus != :paid THEN 1 ELSE 0 END) AS deliveredUnpaid`,
      ])
      .setParameters({
        pending: OrderStatus.PENDING,
        confirmed: OrderStatus.CONFIRMED,
        delivering: OrderStatus.DELIVERING,
        delivered: OrderStatus.DELIVERED,
        cashOnDelivery: PaymentMethod.CASH_ON_DELIVERY,
        unpaid: PaymentStatus.UNPAID,
        paid: PaymentStatus.PAID,
      })
      .getRawOne<{
        pending?: string | number | null;
        confirmed?: string | number | null;
        delivering?: string | number | null;
        unpaidCod?: string | number | null;
        deliveredUnpaid?: string | number | null;
      }>();

    return {
      pending: Number(result?.pending) || 0,
      confirmed: Number(result?.confirmed) || 0,
      delivering: Number(result?.delivering) || 0,
      unpaidCod: Number(result?.unpaidCod) || 0,
      deliveredUnpaid: Number(result?.deliveredUnpaid) || 0,
    };
  }
}
