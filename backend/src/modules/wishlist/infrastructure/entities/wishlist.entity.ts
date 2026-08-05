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
import { WishlistItemTypeOrm } from './wishlist-item.entity';

@Entity('wishlists')
export class WishlistTypeOrm {
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
  user!: UserTypeOrm;

  @OneToMany(() => WishlistItemTypeOrm, (wishlistItem) => wishlistItem.wishlist)
  wishlistItems!: WishlistItemTypeOrm[];
}
