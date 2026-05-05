import {
  Body,
  Controller,
  Get,
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

@Controller('genres')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin', 'staff')
export class GenresController {
  public constructor(
    private readonly findGenresUseCase: FindGenresUseCase,
    private readonly findOneGenreUseCase: FindOneGenreUseCase,
    private readonly createGenreUseCase: CreateGenreUseCase,
    private readonly renameGenreUseCase: RenameGenreUseCase,
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
  public async create(
    @Body() request: CreateGenreRequest,
    @CurrentUser('userId') actorId: string,
    @CurrentUser('roleId') roleId: string,
  ): Promise<void> {
    try {
      await this.createGenreUseCase.execute(request, actorId, roleId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Patch(':id')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenameGenreRequest,
    @CurrentUser('userId') actorId: string,
    @CurrentUser('roleId') roleId: string,
  ): Promise<void> {
    try {
      await this.renameGenreUseCase.execute(id, request, actorId, roleId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
