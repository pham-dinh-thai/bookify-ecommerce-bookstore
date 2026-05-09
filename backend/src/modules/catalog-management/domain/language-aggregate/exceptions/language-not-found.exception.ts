import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Language is not found', 'LANGUAGE_NOT_FOUND');
  }
}
