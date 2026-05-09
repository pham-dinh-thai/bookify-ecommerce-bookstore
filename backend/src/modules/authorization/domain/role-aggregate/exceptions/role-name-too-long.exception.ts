import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RoleNameTooLongException extends BadRequestDomainException {
  public constructor() {
    super(
      `Role name can't be too long (max: 50 characters)`,
      'ROLE_NAME_TOO_LONG',
    );
  }
}
