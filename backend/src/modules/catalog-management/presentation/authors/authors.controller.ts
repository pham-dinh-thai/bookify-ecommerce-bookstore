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
import { FindAuthorsUseCase } from '../../application/author-use-cases/find-authors/find-authors.use-case';
import { FindOneAuthorUseCase } from '../../application/author-use-cases/find-one-author/find-one-author.use-case';
import { AuthorReadModel } from '../../domain/author-aggregate/read-models/author.read-model';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CreateAuthorRequest } from './requests/create-author.request';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CreateAuthorUseCase } from '../../application/author-use-cases/create-author/create-author.use-case';
import { RenameAuthorUseCase } from '../../application/author-use-cases/rename-author/rename-author.use-case';
import { request } from 'http';
import { RenameAuthorRequest } from './requests/rename-author.request';
import { DeleteAuthorUseCase } from '../../application/author-use-cases/delete-author/delete-author.use-case';

@Controller('authors')
export class AuthorsController {
  public constructor(
    private readonly findAuthorsUseCase: FindAuthorsUseCase,
    private readonly findOneAuthorUseCase: FindOneAuthorUseCase,
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly renameAuthorUseCase: RenameAuthorUseCase,
    private readonly deleteAuthorUseCase: DeleteAuthorUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<AuthorReadModel[]> {
    const authors = await this.findAuthorsUseCase.execute();

    return authors;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<AuthorReadModel | null> {
    const author = await this.findOneAuthorUseCase.execute(id);

    return author;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async create(
    @Body() request: CreateAuthorRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.createAuthorUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenameAuthorRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.renameAuthorUseCase.execute(id, request, actorId);
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
      await this.deleteAuthorUseCase.execute(id, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
