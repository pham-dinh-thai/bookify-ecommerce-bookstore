import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class EmptyGenreIdException extends BadRequestDomainException {
  public constructor() {
    super('Genre id is required', 'EMPTY_GENRE_ID');
  }
}
