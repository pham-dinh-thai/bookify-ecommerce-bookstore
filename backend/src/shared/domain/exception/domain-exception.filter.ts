import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from './domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  public catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.statusCode).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
