import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedDomainException } from '../../domain/exception/domain.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw new UnauthorizedDomainException('Unauthorized', 'UNAUTHORIZED');
    }
    return user;
  }
}
