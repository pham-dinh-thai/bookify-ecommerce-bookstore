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
import { LanguageReadModel } from '../../domain/language-aggregate/read-models/language.read-model';
import { FindLanguagesUseCase } from '../../application/language-use-cases/find-languages/find-languages.use-case';
import { FindOneLanguageUseCase } from '../../application/language-use-cases/find-one-language/find-one-language.use-case';
import { CreateLanguageRequest } from './requests/create-language.request';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CreateLanguageUseCase } from '../../application/language-use-cases/create-language/create-language.use-case';
import { RenameLanguageUseCase } from '../../application/language-use-cases/rename-language/rename-language.use-case';
import { RenameLanguageRequest } from './requests/rename-language.request';
import { DeleteLanguageUseCase } from '../../application/language-use-cases/delete-language/delete-language.use-case';
import { FindTotalLanguageUseCase } from '../../application/language-use-cases/find-total-language/find-total-language.use-case';
import { FindLanguagesResponse } from '../../application/language-use-cases/find-languages/find-languages.response';

@Controller('languages')
export class LanguagesController {
  public constructor(
    private readonly findLanguagesUseCase: FindLanguagesUseCase,
    private readonly findOneLanguageUseCase: FindOneLanguageUseCase,
    private readonly findTotalLanguageUseCase: FindTotalLanguageUseCase,
    private readonly createLanguageUseCase: CreateLanguageUseCase,
    private readonly renameLanguageUseCase: RenameLanguageUseCase,
    private readonly deleteLanguageUseCase: DeleteLanguageUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindLanguagesResponse> {
    const response = await this.findLanguagesUseCase.execute(
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
    const total = await this.findTotalLanguageUseCase.execute();

    return total;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<LanguageReadModel | null> {
    const language = await this.findOneLanguageUseCase.execute(id);

    return language;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async create(
    @Body() request: CreateLanguageRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.createLanguageUseCase.execute(request, actorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenameLanguageRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.renameLanguageUseCase.execute(id, request, actorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.deleteLanguageUseCase.execute(id, actorId);
  }
}
