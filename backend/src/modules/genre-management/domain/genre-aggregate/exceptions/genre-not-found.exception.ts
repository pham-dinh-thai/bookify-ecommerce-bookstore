import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class GenreNotFoundException extends DomainException {
  public constructor() {
    super('Genre is not found', 'GENRE_NOT_FOUND');
  }
}
