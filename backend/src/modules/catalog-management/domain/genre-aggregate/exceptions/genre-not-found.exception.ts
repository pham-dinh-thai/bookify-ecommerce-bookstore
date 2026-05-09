import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class GenreNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Genre is not found', 'GENRE_NOT_FOUND');
  }
}
