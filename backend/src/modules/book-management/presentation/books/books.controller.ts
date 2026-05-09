import { Controller, Get } from '@nestjs/common';

@Controller('books')
export class BooksController {
  @Get('total')
  public async total(): Promise<number> {
    return 1;
  }
}
