import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RoleNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Role name is required!', 'ROLE_NAME_EMPTY');
  }
}
