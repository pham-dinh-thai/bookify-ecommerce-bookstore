import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmptyGenreNameException extends DomainException {
  public constructor() {
    super('Genre name is required', 'EMPTY_GENRE_NAME');
  }
}
