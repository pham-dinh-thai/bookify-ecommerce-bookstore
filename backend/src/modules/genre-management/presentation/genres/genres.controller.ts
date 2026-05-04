import { Controller, Get, Post } from '@nestjs/common';

@Controller('genres')
export class GenresController {
  @Get()
  public async findAll() {
    return 'all';
  }

  @Get(':id')
  public async findOne() {
    return 'one';
  }
}
