import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Author id is required', 'AUTHOR_ID_EMPTY');
  }
}
