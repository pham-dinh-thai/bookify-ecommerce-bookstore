import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookGenreTypeOrm } from './book-genre.entity';

@Entity('books')
export class BookTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  author!: string;

  @Column({ type: 'varchar', length: 255 })
  publisher!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', length: 100 })
  language!: string;

  @Column({ type: 'int' })
  pageCount!: number;

  @Column({ type: 'date' })
  publishedDate!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => BookGenreTypeOrm, (bookGenre) => bookGenre.book)
  bookGenres!: BookGenreTypeOrm[];
}
