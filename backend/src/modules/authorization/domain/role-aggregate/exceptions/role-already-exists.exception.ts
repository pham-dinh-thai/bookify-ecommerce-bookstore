import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RoleAlreadyExistsException extends ConflictDomainException {
  public constructor(id: string) {
    super(`Role '${id}' already exists`, 'ROLE_ALREADY_EXISTS');
  }
}
