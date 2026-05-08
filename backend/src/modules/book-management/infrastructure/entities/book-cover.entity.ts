import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BookTypeOrm } from './book.entity';

@Entity('book_covers')
export class BookCoverTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  bookId!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'boolean', default: false })
  isPrimary!: boolean;

  @Column({ type: 'integer', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => BookTypeOrm, (book) => book.covers)
  @JoinColumn({ name: 'bookId' })
  book!: BookTypeOrm;
}
