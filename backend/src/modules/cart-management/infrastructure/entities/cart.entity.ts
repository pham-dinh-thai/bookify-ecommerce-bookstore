import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { CartItemTypeOrm } from './cart-item.entity';

@Entity('carts')
export class CartTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => UserTypeOrm, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  customer!: UserTypeOrm;

  @OneToMany(() => CartItemTypeOrm, (cartItem) => cartItem.cart)
  cartItems!: CartItemTypeOrm[];
}
