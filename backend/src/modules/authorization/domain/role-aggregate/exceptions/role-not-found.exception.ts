import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RoleNotFoundException extends NotFoundDomainException {
  public constructor(id: string) {
    super(`Role with id '${id}' is not found`, 'ROLE_NOT_FOUND');
  }
}
