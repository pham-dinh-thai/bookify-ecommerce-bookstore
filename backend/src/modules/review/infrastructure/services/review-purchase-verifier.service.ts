import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository.js';
import { OrderStatus } from '../../../order/domain/order-aggregate/enums/order-status.enum';
import { OrderItemTypeOrm } from '../../../order/infrastructure/entities/order-item.entity';
import { IReviewPurchaseVerifier } from '../../domain/services/review-purchase-verifier.service';

@Injectable()
export class TypeormReviewPurchaseVerifier implements IReviewPurchaseVerifier {
  public constructor(
    @InjectRepository(OrderItemTypeOrm)
    private readonly orderItemRepository: Repository<OrderItemTypeOrm>,
  ) {}

  public async hasPurchased(userId: string, bookId: string): Promise<boolean> {
    return this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .where('orderItem.productId = :bookId', { bookId })
      .andWhere('order.userId = :userId', { userId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.DELIVERED, OrderStatus.COMPLETED],
      })
      .getExists();
  }
}
