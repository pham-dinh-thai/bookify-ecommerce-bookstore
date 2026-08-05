import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHOR_EXISTS_CHECKER,
  type IAuthorExistsChecker,
} from '../../../../catalog-management/domain/author-aggregate/services/author-exists-checker.service';
import {
  type IPublisherExistsChecker,
  PUBLISHER_EXISTS_CHECKER,
} from '../../../../catalog-management/domain/publisher-aggregate/services/publisher-exists-checker.service';
import {
  GENRE_EXISTS_CHECKER,
  type IGenreExistsChecker,
} from '../../../../catalog-management/domain/genre-aggregate/services/genre-exists-checker.service';
import {
  type ILanguageExistsChecker,
  LANGUAGE_EXISTS_CHECKER,
} from '../../../../catalog-management/domain/language-aggregate/services/language-exists-checker.service';
import { IBookValidation } from '../../../domain/services/book-validation.service';

@Injectable()
export class BookValidation implements IBookValidation {
  public constructor(
    @Inject(AUTHOR_EXISTS_CHECKER)
    private readonly authorExistsChecker: IAuthorExistsChecker,

    @Inject(PUBLISHER_EXISTS_CHECKER)
    private readonly publisherExistsChecker: IPublisherExistsChecker,

    @Inject(GENRE_EXISTS_CHECKER)
    private readonly genreExistsChecker: IGenreExistsChecker,

    @Inject(LANGUAGE_EXISTS_CHECKER)
    private readonly languageExistsChecker: ILanguageExistsChecker,
  ) {}

  public async validateBookRelations(request: {
    authorIds: string[];
    publisherId: string;
    genreIds: string[];
    languageId: string;
  }): Promise<void> {
    await Promise.all([
      ...request.authorIds.map((id) =>
        this.authorExistsChecker.existsOrThrow(id),
      ),
      this.publisherExistsChecker.existsOrThrow(request.publisherId),
      ...request.genreIds.map((id) =>
        this.genreExistsChecker.existsOrThrow(id),
      ),
      this.languageExistsChecker.existsOrThrow(request.languageId),
    ]);
  }
}
