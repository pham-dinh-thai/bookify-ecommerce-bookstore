import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageNotFoundException extends DomainException {
  public constructor() {
    super('Language is not found', 'LANGUAGE_NOT_FOUND');
  }
}
