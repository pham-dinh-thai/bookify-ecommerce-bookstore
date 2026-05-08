import { Controller, Get, Param } from '@nestjs/common';
import { LanguageReadModel } from '../../domain/language-aggregate/read-models/language.read-model';
import { FindLanguagesUseCase } from '../../application/language-use-cases/find-languages/find-languages.use-case';
import { FindOneLanguageUseCase } from '../../application/language-use-cases/find-one-language/find-one-language.use-case';

@Controller('languages')
export class LanguagesController {
  public constructor(
    private readonly findLanguagesUseCase: FindLanguagesUseCase,
    private readonly findOneLanguageUseCase: FindOneLanguageUseCase,
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
}
