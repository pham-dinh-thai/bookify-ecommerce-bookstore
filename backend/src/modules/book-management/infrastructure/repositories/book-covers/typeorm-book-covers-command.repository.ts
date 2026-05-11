import { Injectable } from '@nestjs/common';
import { IBookCoversCommandRepository } from '../../../domain/book-aggregate/entities/book-cover/repositories/book-covers-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { BookCover } from '../../../domain/book-aggregate/entities/book-cover/book-cover.entity';
import { BookCoverTypeOrm } from '../../entities/book-cover.entity';
import { BookCoverNotFoundException } from '../../../domain/book-aggregate/entities/book-cover/exceptions/book-cover-not-found.exception';
import { BookCoversMapper } from '../../mappers/book-covers.mapper';

@Injectable()
export class TypeOrmBookCoversCommandRepository implements IBookCoversCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<BookCover> {
    const bookCoverTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(BookCoverTypeOrm, { where: { id } });

    if (!bookCoverTypeOrm) {
      throw new BookCoverNotFoundException();
    }

    return BookCoversMapper.toDomain(bookCoverTypeOrm);
  }

  public async save(bookId, bookCover: BookCover): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(BookCoverTypeOrm, BookCoversMapper.toTypeOrm(bookId, bookCover));
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookCoverTypeOrm, { id });
  }
}
