import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmptyGenreNameException extends BadRequestDomainException {
  public constructor() {
    super('Genre name is required', 'EMPTY_GENRE_NAME');
  }
}
