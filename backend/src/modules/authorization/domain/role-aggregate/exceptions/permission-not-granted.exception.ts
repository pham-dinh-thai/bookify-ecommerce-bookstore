import { ForbiddenDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PermissionNotGrantedException extends ForbiddenDomainException {
  public constructor(roleId: string, permissionId: string) {
    super(
      `Permission ${permissionId} is not granted in '${roleId}'`,
      'PERMISSION_NOT_GRANTED',
    );
  }
}
