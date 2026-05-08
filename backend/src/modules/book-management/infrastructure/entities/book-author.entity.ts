import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BookTypeOrm } from './book.entity';
import { AuthorTypeOrm } from '../../../catalog-management/infrastructure/entities/author.entity';

@Entity('books_authors')
export class BookAuthorTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  bookId!: string;

  @PrimaryColumn({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => BookTypeOrm)
  @JoinColumn({ name: 'bookId' })
  book!: BookTypeOrm;

  @ManyToOne(() => AuthorTypeOrm)
  @JoinColumn({ name: 'authorId' })
  author!: AuthorTypeOrm;
}
