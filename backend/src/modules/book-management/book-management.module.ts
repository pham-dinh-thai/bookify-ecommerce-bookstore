import { Module } from '@nestjs/common';
import { BooksController } from './presentation/books/books.controller';

@Module({
  controllers: [BooksController]
})
export class BookManagementModule {}
