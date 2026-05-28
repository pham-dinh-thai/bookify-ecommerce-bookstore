import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { OrderItemTypeOrm } from './order-item.entity';
import { OrderStatus } from '../../domain/order-aggregate/enums/order-status.enum';
import { PaymentStatus } from '../../domain/order-aggregate/enums/payment-status.enum';
import { PaymentMethod } from '../../domain/order-aggregate/enums/payment-method.enum';

@Entity('orders')
export class OrderTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status!: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @Column()
  shippingAddress!: string;

  @Column()
  phoneNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserTypeOrm)
  @JoinColumn({ name: 'userId' })
  user!: UserTypeOrm;

  @OneToMany(() => OrderItemTypeOrm, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items!: OrderItemTypeOrm[];
}
