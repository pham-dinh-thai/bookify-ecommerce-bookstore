import { Injectable } from '@nestjs/common';
import { IBookGenresCommandRepository } from '../../../domain/book-aggregate/entities/book-genre/repositories/book-genres-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { BookGenreTypeOrm } from '../../entities/book-genre.entity';
import { BookGenreNotFoundException } from '../../../domain/book-aggregate/entities/book-genre/exceptions/book-genre-not-found.exception';
import { BookGenre } from '../../../domain/book-aggregate/entities/book-genre/book-genre.entity';
import { BookGenresMapper } from '../../mappers/book-genres.mapper';

@Injectable()
export class TypeormBookGenresCommandRepository implements IBookGenresCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(bookId: string, genreId: string): Promise<BookGenre> {
    const bookGenreTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(BookGenreTypeOrm, { where: { bookId, genreId } });

    if (!bookGenreTypeOrm) {
      throw new BookGenreNotFoundException();
    }

    return BookGenresMapper.toDomain(bookGenreTypeOrm);
  }

  public async save(bookGenre: BookGenre): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(BookGenreTypeOrm, BookGenresMapper.toTypeOrm(bookGenre));
  }

  public async delete(bookId: string, genreId: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(BookGenreTypeOrm, { bookId, genreId });
  }
}
