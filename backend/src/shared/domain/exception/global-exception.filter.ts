import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { DomainException } from './domain.exception';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (response.headersSent) {
      return;
    }

    if (exception instanceof DomainException) {
      response.status(exception.statusCode).json({
        code: exception.code,
        message: exception.message,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: 'HTTP_EXCEPTION',
        message: exception.message,
      });
    } else {
      console.error(exception);
      response.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  }
}
