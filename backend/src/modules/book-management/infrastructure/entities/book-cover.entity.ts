import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { BookTypeOrm } from './book.entity';

@Entity('book_covers')
@Index(['bookId', 'displayOrder'], { unique: true })
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

  @ManyToOne(() => BookTypeOrm, (book) => book.covers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'bookId' })
  book!: BookTypeOrm;
}
