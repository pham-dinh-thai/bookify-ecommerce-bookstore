import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';
import { OrderTypeOrm } from './order.entity';

@Entity('order_items')
export class OrderItemTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => BookTypeOrm)
  @JoinColumn({ name: 'productId' })
  product!: BookTypeOrm;

  @ManyToOne(() => OrderTypeOrm, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: OrderTypeOrm;
}
