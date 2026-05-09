import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PublisherNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Publisher name is required', 'PUBLISHER_NAME_EMPTY');
  }
}
