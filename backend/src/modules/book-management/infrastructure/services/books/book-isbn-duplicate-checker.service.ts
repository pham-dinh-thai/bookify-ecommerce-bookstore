import { Injectable } from '@nestjs/common';
import { IBookIsbnDuplicateChecker } from '../../../domain/book-aggregate/services/book-isbn-duplicate-checker.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BookTypeOrm } from '../../entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookIsbnDuplicateChecker implements IBookIsbnDuplicateChecker {
  public constructor(
    @InjectRepository(BookTypeOrm)
    private readonly repository: Repository<BookTypeOrm>,
  ) {}

  public async check(isbn: string): Promise<boolean> {
    const existing = await this.repository.findOne({ where: { isbn } });

    return !!existing;
  }
}
