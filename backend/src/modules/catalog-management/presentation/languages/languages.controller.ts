import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

@Controller('languages')
export class LanguagesController {
  public constructor(
    private readonly findLanguagesUseCase: FindLanguagesUseCase,
    private readonly findOneLanguageUseCase: FindOneLanguageUseCase,
    private readonly createLanguageUseCase: CreateLanguageUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<LanguageReadModel[]> {
    const languages = await this.findLanguagesUseCase.execute();

    return languages;
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
    try {
      await this.createLanguageUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
