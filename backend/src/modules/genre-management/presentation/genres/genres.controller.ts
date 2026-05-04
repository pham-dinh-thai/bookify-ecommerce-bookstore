import { Controller, Get, Param, Post } from '@nestjs/common';
import { FindGenresUseCase } from '../../application/genre-use-cases/find-genres/find-genres.use-case';
import { FindOneGenreUseCase } from '../../application/genre-use-cases/find-one-genre/find-one-genre.use-case';

@Controller('genres')
export class GenresController {
  public constructor(
    private readonly findGenresUseCase: FindGenresUseCase,
    private readonly findOneGenreUseCase: FindOneGenreUseCase,
  ) {}

  @Get()
  public async findAll() {
    return await this.findGenresUseCase.execute();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.findOneGenreUseCase.execute(id);
  }
}
