import { ErrorStatus } from './error-status.enum';

export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestDomainException extends DomainException {
  constructor(message: string = 'Bad Request Exception', code: string) {
    super(message, code, ErrorStatus.BAD_REQUEST);
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(
    message: string = 'Unauthorized Exception',
    code: string = 'UNAUTHORIZED',
  ) {
    super(message, code, ErrorStatus.UNAUTHORIZED);
  }
}

export class ForbiddenDomainException extends DomainException {
  constructor(message: string = 'Forbidden Exception', code: string) {
    super(message, code, ErrorStatus.FORBIDDEN);
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(message: string = 'Not Found Exception', code: string) {
    super(message, code, ErrorStatus.NOT_FOUND);
  }
}

export class ConflictDomainException extends DomainException {
  constructor(message: string = 'Conflict Exception', code: string) {
    super(message, code, ErrorStatus.CONFLICT);
  }
}

export class UnprocessableEntityDomainException extends DomainException {
  constructor(
    message: string = 'Unprocessable Entity Exception',
    code: string,
  ) {
    super(message, code, ErrorStatus.UNPROCESSABLE_ENTITY);
  }
}
