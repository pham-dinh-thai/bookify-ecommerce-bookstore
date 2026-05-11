import { Injectable } from '@nestjs/common';
import { IBooksQueryRepository } from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BookTypeOrm } from '../../entities/book.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';
import { BooksMapper } from '../../mappers/books.mapper';

@Injectable()
export class TypeormBooksQueryRepository implements IBooksQueryRepository {
  public constructor(
    @InjectRepository(BookTypeOrm)
    private readonly repository: Repository<BookTypeOrm>,
  ) {}

  public async findAll(): Promise<BookReadModel[]> {
    const books = await this.repository.find();

    return books.map((book) => BooksMapper.toReadModel(book));
  }

  public async findOne(id: string): Promise<BookReadModel | null> {
    const book = await this.repository.findOneBy({ id });

    return book ? BooksMapper.toReadModel(book) : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('book');

    if (search) {
      query.where('book.title LIKE :search', { search: `%${search}%` });
    }

    return query.getCount() ?? 0;
  }
}
