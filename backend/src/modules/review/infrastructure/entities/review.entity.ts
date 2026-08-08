import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';

@Entity('reviews')
@Unique('UQ_reviews_book_user', ['bookId', 'userId'])
@Index('IDX_reviews_book_created_at', ['bookId', 'createdAt'])
export class ReviewTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  bookId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => BookTypeOrm, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'bookId' })
  book!: BookTypeOrm;

  @ManyToOne(() => UserTypeOrm, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: UserTypeOrm;
}
