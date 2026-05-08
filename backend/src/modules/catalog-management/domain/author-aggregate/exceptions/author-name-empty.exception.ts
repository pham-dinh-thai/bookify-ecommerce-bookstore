import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorNameEmptyException extends DomainException {
  public constructor() {
    super('Author name is required', 'AUTHOR_NAME_EMPTY');
  }
}
