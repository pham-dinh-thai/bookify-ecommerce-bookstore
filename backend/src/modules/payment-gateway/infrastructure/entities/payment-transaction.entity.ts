import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderTypeOrm } from '../../../order/infrastructure/entities/order.entity';
import { PaymentProvider } from '../../domain/payment-transaction-aggregate/enums/payment-provider.enum';
import { PaymentTransactionStatus } from '../../domain/payment-transaction-aggregate/enums/payment-transaction-status.enum';

@Entity('payment_transactions')
@Index(['provider', 'providerOrderId'], { unique: true })
export class PaymentTransactionTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider!: PaymentProvider;

  @Column({ type: 'enum', enum: PaymentTransactionStatus })
  status!: PaymentTransactionStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency!: string;

  @Column({ type: 'varchar', length: 100 })
  providerOrderId!: string;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  providerTransactionId!: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  payUrl!: string | null;

  @Column({ type: 'json', nullable: true })
  rawResponse!: Record<string, any> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => OrderTypeOrm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: OrderTypeOrm;
}
