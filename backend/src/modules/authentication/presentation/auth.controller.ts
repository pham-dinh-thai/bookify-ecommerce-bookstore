import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login/login.use-case';
import { LoginRequest } from './requests/login.request';
import ExceptionHandler from '../../../shared/domain/exception/exception.handler';
import { RegisterUseCase } from '../application/use-cases/register/register.use-case';
import { RegisterRequest } from './requests/register.request';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { LogoutUseCase } from '../application/use-cases/logout/logout.use-case';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

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
  public async register(@Body() request: RegisterRequest): Promise<void> {
    try {
      await this.registerUseCase.execute(request);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public async logout(
    @Req() request: { user: { id: string; jti?: string; exp: number } },
  ): Promise<void> {
    try {
      await this.logoutUseCase.execute(
        request.user.id,
        request.user.jti,
        request.user.exp,
      );
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
