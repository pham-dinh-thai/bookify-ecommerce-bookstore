import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorIdEmptyException extends DomainException {
  public constructor() {
    super('Author id is required', 'AUTHOR_ID_EMPTY');
  }
}
