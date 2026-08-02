import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { WishlistTypeOrm } from './wishlist.entity';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';

@Entity('wishlist_items')
@Unique('UQ_wishlist_item_wishlist_item', ['wishlistId', 'itemId'])
export class WishlistItemTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  wishlistId!: string;

  @Column({ type: 'uuid' })
  itemId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => WishlistTypeOrm, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wishlistId' })
  wishlist!: WishlistTypeOrm;

  @ManyToOne(() => BookTypeOrm)
  @JoinColumn({ name: 'itemId' })
  book!: BookTypeOrm;
}
