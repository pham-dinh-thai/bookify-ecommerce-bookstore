import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class ResourceInvalidException extends BadRequestDomainException {
  public constructor(resource: string) {
    super(
      `Resource with value '${resource}' is not a valid option`,
      'RESOURCE_INVALID_OPTION',
    );
  }
}
