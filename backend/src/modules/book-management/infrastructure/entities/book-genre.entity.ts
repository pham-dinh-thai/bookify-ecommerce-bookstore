import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BookTypeOrm } from './book.entity';
import { GenreTypeOrm } from '../../../catalog-management/infrastructure/entities/genre.entity';

@Entity('books_genres')
export class BookGenreTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  bookId!: string;

  @PrimaryColumn({ type: 'uuid' })
  genreId!: string;

  @ManyToOne(() => BookTypeOrm)
  @JoinColumn({ name: 'bookId' })
  book!: BookTypeOrm;

  @ManyToOne(() => GenreTypeOrm)
  @JoinColumn({ name: 'genreId' })
  genre!: GenreTypeOrm;
}
