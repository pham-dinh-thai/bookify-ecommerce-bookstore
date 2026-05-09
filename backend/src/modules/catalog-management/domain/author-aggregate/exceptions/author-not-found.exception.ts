import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class AuthorNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Author is not found', 'AUTHOR_NOT_FOUND');
  }
}
