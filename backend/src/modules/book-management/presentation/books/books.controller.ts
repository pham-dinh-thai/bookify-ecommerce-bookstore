import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindBooksUseCase } from '../../application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from '../../application/book-use-cases/find-one-book/find-one-book.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { CreateBookRequest } from './requests/create-book.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { CreateBookUseCase } from '../../application/book-use-cases/create-book/create-book.use-case';
import { UpdateBookUseCase } from '../../application/book-use-cases/update-book/update-book.use-case';
import { UpdateBookRequest } from './requests/update-book.request';
import { AddBookCoverRequest } from './requests/add-book-cover.request';
import { AddBookCoverUseCase } from '../../application/book-use-cases/add-book-cover/add-book-cover.use-case';
import { RemoveBookCoverUseCase } from '../../application/book-use-cases/remove-book-cover/remove-book-cover.use-case';
import { UpdateBookPriceRequest } from './requests/update-book-price.request';
import { UpdateBookPriceUseCase } from '../../application/book-use-cases/update-book-price/update-book-price.use-case';
import { ImportBookStockRequest } from './requests/import-book-stock.request';
import { ImportBookStockUseCase } from '../../application/book-use-cases/import-book-stock/import-book-stock.use-case';
import { AdjustBookStockRequest } from './requests/adjust-book-stock.request';
import { AdjustBookStockUseCase } from '../../application/book-use-cases/adjust-book-stock/adjust-book-stock.use-case';
import { DeleteBookUseCase } from '../../application/book-use-cases/delete-book/delete-book.use-case';
import { FindBooksResponse } from '../../application/book-use-cases/find-books/find-books.response';
import { ChangePrimaryBookCoverUseCase } from '../../application/book-use-cases/change-primary-book-cover/change-primary-book-cover.use-case';

@Controller('books')
export class BooksController {
  public constructor(
    private readonly findBooksUseCase: FindBooksUseCase,
    private readonly findOneBookUseCase: FindOneBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly addBookCoverUseCase: AddBookCoverUseCase,
    private readonly removeBookCoverUseCase: RemoveBookCoverUseCase,
    private readonly changePrimaryBookCoverUseCase: ChangePrimaryBookCoverUseCase,
    private readonly updateBookPriceUseCase: UpdateBookPriceUseCase,
    private readonly importBookStockUseCase: ImportBookStockUseCase,
    private readonly adjustBookStockUseCase: AdjustBookStockUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindBooksResponse> {
    const response = await this.findBooksUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );

    return response;
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

  @Patch(':id/book-cover/:coverId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async changePrimaryBookCover(
    @Param('id') id: string,
    @Param('coverId') coverId: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.changePrimaryBookCoverUseCase.execute(id, coverId, actorId);
  }

  @Patch(':id/price')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async updatePrice(
    @Param('id') id: string,
    @Body() request: UpdateBookPriceRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.updateBookPriceUseCase.execute(id, request, actorId);
  }

  @Patch(':id/stock/import')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async importStock(
    @Param('id') id: string,
    @Body() request: ImportBookStockRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.importBookStockUseCase.execute(id, request, actorId);
  }

  @Patch(':id/stock/adjust')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async adjustStock(
    @Param('id') id: string,
    @Body() request: AdjustBookStockRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.adjustBookStockUseCase.execute(id, request, actorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async delete(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.deleteBookUseCase.execute(id, actorId);
  }
}
