import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login/login.use-case';
import { LoginRequest } from './requests/login.request';
import ExceptionHandler from '../../../shared/domain/exception/exception.handler';

@Controller('auth')
export class AuthController {
  public constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  public async login(
    @Body() request: LoginRequest,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      return await this.loginUseCase.execute(request);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Post('/register')
  public async register(): Promise<void> {
    try {
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
