import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FindBooksUseCase } from '../../application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from '../../application/book-use-cases/find-one-book/find-one-book.use-case';
import { FindTotalBookUseCase } from '../../application/book-use-cases/find-total-book/find-total-book.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CreateBookRequest } from './requests/create-book.request';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateBookUseCase } from '../../application/book-use-cases/create-book/create-book.use-case';
import { UpdateBookUseCase } from '../../application/book-use-cases/update-book/update-book.use-case';
import { UpdateBookRequest } from './requests/update-book.request';
import { AddBookCoverRequest } from './requests/add-book-cover.request';
import { AddBookCoverUseCase } from '../../application/book-use-cases/add-book-cover/add-book-cover.use-case';
import { RemoveBookCoverUseCase } from '../../application/book-use-cases/remove-book-cover/remove-book-cover.use-case';

@Controller('books')
export class BooksController {
  public constructor(
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly findOneBookUseCase: FindOneBookUseCase,
    private readonly findTotalBookUseCase: FindTotalBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly addBookCoverUseCase: AddBookCoverUseCase,
    private readonly removeBookCoverUseCase: RemoveBookCoverUseCase,
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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateBookRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.updateBookUseCase.execute(id, request, actorId);
  }

  @Post(':id/book-cover')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async addBookCover(
    @Param('id') id: string,
    @Body() request: AddBookCoverRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.addBookCoverUseCase.execute(id, request, actorId);
  }

  @Delete(':bookId/book-cover/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async removeBookCover(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.removeBookCoverUseCase.execute(bookId, id, actorId);
  }
}
