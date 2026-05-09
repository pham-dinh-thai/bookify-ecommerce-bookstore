import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PermissionAlreadyExistsException extends ConflictDomainException {
  public constructor(id: string) {
    super(
      `Permission with id '${id}' already exists`,
      'PERMISSION_ALREADY_EXISTS',
    );
  }
}
