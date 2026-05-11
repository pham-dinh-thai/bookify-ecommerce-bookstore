import { Controller, Get, Param } from '@nestjs/common';
import { FindBooksUseCase } from '../../application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from '../../application/book-use-cases/find-one-book/find-one-book.use-case';

@Controller('books')
export class BooksController {
  public constructor(
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly findOneBookUseCase: FindOneBookUseCase,
  ) {}

  @Get()
  public async findAll() {
    return await this.findBooksUseCase.execute();
  }

  @Get('total')
  public async total(): Promise<number> {
    return 1;
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.findOneBookUseCase.execute(id);
  }
}
