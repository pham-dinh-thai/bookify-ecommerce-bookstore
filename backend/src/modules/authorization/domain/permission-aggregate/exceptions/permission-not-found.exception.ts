import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PermissionNotFoundException extends NotFoundDomainException {
  public constructor(id: string) {
    super(`Permission with id '${id}' is not found`, 'PERMISSION_NOT_FOUND');
  }
}
