import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthCallbackGuard extends AuthGuard('google') {
  handleRequest(
    err: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): any {
    if (err || !user) {
      const response = context.switchToHttp().getResponse();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';

      if (!response.headersSent) {
        response.redirect(`${frontendUrl}/login`);
      }

      return null;
    }

    return user;
  }
}
