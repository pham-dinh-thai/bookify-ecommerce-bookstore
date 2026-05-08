import { Controller, Get, Param } from '@nestjs/common';
import { FindAuthorsUseCase } from '../../application/author-use-cases/find-authors/find-authors.use-case';
import { FindOneAuthorUseCase } from '../../application/author-use-cases/find-one-author/find-one-author.use-case';
import { AuthorReadModel } from '../../domain/author-aggregate/read-models/author.read-model';

@Controller('authors')
export class AuthorsController {
  public constructor(
    private readonly findAuthorsUseCase: FindAuthorsUseCase,
    private readonly findOneAuthorUseCase: FindOneAuthorUseCase,
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
}
