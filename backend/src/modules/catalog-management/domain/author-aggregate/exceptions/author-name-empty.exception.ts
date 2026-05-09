import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Author name is required', 'AUTHOR_NAME_EMPTY');
  }
}
