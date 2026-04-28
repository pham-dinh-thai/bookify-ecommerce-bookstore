import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LoginFailedException extends DomainException {
  public constructor() {
    super('Email or password incorrect', 'LOGIN_FAILED', 401);
  }
}
