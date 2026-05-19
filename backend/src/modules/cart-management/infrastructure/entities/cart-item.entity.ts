import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartTypeOrm } from './cart.entity';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';

@Entity('cart_items')
export class CartItemTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  cartId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CartTypeOrm, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cart!: CartTypeOrm;

  @ManyToOne(() => BookTypeOrm)
  @JoinColumn({ name: 'productId' })
  product!: BookTypeOrm;
}
