import { DomainException } from './domain.exception';

export class UnauthorizedException extends DomainException {
  public constructor() {
    super('You are not allow to do this action', 'UNAUTHORIZED', 401);
  }
}
