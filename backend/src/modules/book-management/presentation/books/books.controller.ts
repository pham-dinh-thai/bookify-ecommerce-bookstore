import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FindBooksUseCase } from '../../application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from '../../application/book-use-cases/find-one-book/find-one-book.use-case';
import { FindTotalBookUseCase } from '../../application/book-use-cases/find-total-book/find-total-book.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CreateBookRequest } from './requests/create-book.request';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateBookUseCase } from '../../application/book-use-cases/create-book/create-book.use-case';

@Controller('books')
export class BooksController {
  public constructor(
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly findOneBookUseCase: FindOneBookUseCase,
    private readonly findTotalBookUseCase: FindTotalBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
  ) {}

  @Get()
  public async findAll() {
    return await this.findBooksUseCase.execute();
  }

  @Get('total')
  public async total(): Promise<number> {
    return await this.findTotalBookUseCase.execute();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.findOneBookUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async create(
    @Body() request: CreateBookRequest,
    @CurrentUser('userId') actorId,
  ): Promise<void> {
    await this.createBookUseCase.execute(request, actorId);
  }
}
