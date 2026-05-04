import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmptyGenreIdException extends DomainException {
  public constructor() {
    super('Genre id is required', 'EMPTY_GENRE_ID');
  }
}
