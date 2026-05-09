import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PermissionAlreadyGrantedException extends ConflictDomainException {
  public constructor(permission: string) {
    super(
      `Permission '${permission}' is already granted`,
      'PERMISSION_ALREADY_GRANTED',
    );
  }
}
