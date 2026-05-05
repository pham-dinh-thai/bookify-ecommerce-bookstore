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
  UseGuards,
} from '@nestjs/common';
import { FindGenresUseCase } from '../../application/genre-use-cases/find-genres/find-genres.use-case';
import { FindOneGenreUseCase } from '../../application/genre-use-cases/find-one-genre/find-one-genre.use-case';
import { CreateGenreUseCase } from '../../application/genre-use-cases/create-genre/create-genre.use-case';
import { CreateGenreRequest } from './requests/create-genre.request';
import { GenreReadModel } from '../../domain/genre-aggregate/read-models/genre.read-model';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RenameGenreRequest } from './requests/rename-genre.request';
import { RenameGenreUseCase } from '../../application/genre-use-cases/rename-genre/rename-genre.use-case';
import { DeleteGenreUseCase } from '../../application/genre-use-cases/delete-genre/delete-genre.use-case';

@Controller('genres')
export class GenresController {
  public constructor(
    private readonly findGenresUseCase: FindGenresUseCase,
    private readonly findOneGenreUseCase: FindOneGenreUseCase,
    private readonly createGenreUseCase: CreateGenreUseCase,
    private readonly renameGenreUseCase: RenameGenreUseCase,
    private readonly deleteGenreUseCase: DeleteGenreUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<GenreReadModel[]> {
    return await this.findGenresUseCase.execute();
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<GenreReadModel | null> {
    return await this.findOneGenreUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async create(
    @Body() request: CreateGenreRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.createGenreUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenameGenreRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.renameGenreUseCase.execute(id, request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.deleteGenreUseCase.execute(id, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
