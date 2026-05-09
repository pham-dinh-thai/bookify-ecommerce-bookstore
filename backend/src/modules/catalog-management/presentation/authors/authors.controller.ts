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
  Query,
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
import { CreateAuthorUseCase } from '../../application/author-use-cases/create-author/create-author.use-case';
import { RenameAuthorUseCase } from '../../application/author-use-cases/rename-author/rename-author.use-case';
import { RenameAuthorRequest } from './requests/rename-author.request';
import { DeleteAuthorUseCase } from '../../application/author-use-cases/delete-author/delete-author.use-case';
import { FindTotalAuthorUseCase } from '../../application/author-use-cases/find-total-author/find-total-author.use-case';
import { FindAuthorsResponse } from '../../application/author-use-cases/find-authors/find-authors.response';

@Controller('authors')
export class AuthorsController {
  public constructor(
    private readonly findAuthorsUseCase: FindAuthorsUseCase,
    private readonly findOneAuthorUseCase: FindOneAuthorUseCase,
    private readonly findTotalAuthorUseCase: FindTotalAuthorUseCase,
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly renameAuthorUseCase: RenameAuthorUseCase,
    private readonly deleteAuthorUseCase: DeleteAuthorUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindAuthorsResponse> {
    const response = await this.findAuthorsUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );

    return response;
  }

  @Get('total')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async total(): Promise<number> {
    const total = await this.findTotalAuthorUseCase.execute();

    return total;
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
    await this.createAuthorUseCase.execute(request, actorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenameAuthorRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.renameAuthorUseCase.execute(id, request, actorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.deleteAuthorUseCase.execute(id, actorId);
  }
}
