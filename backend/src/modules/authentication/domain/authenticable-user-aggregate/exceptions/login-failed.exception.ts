import { UnauthorizedDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LoginFailedException extends UnauthorizedDomainException {
  public constructor() {
    super('Email or password incorrect', 'LOGIN_FAILED');
  }
}
