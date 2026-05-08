import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorNotFoundException extends DomainException {
  public constructor() {
    super('Author is not found', 'AUTHOR_NOT_FOUND');
  }
}
