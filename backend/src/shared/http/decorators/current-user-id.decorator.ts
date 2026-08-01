import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BadRequestDomainException } from '../../domain/exception/domain.exception';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user?.userId) {
      return user.userId;
    }

    const guestId = request.headers['x-guest-id'];
    if (typeof guestId === 'string' && guestId.trim().length > 0) {
      return guestId.trim();
    }

    throw new BadRequestDomainException(
      'Missing identity. Provide a valid token or a guest id.',
      'MISSING_IDENTITY',
    );
  },
);
