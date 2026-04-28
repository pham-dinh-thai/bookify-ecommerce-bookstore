import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from './domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private static STATUS_MAP: Record<string, number> = {
    LOGIN_FAILED: 401,
  };

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = DomainExceptionFilter.STATUS_MAP[exception.code] ?? 400;

    response.status(status).json({
      message: exception.message,
      code: exception.code,
    });
  }
}
