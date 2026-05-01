import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login/login.use-case';
import { LoginRequest } from './requests/login.request';
import ExceptionHandler from '../../../shared/domain/exception/exception.handler';
import { RegisterUseCase } from '../application/use-cases/register/register.use-case';
import { RegisterRequest } from './requests/register.request';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { LogoutUseCase } from '../application/use-cases/logout/logout.use-case';
import { type Response } from 'express';

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
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.loginUseCase.execute(request);

      if (!result) {
        return response.status(401).json({ message: 'Login failed' });
      }

      const { accessToken, refreshToken } = result;

      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return response.json({ accessToken });
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Post('/register')
  public async register(
    @Body() request: RegisterRequest,
  ): Promise<{ tempToken: string }> {
    try {
      return await this.registerUseCase.execute(request);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public async logout(
    @Req() request: { user: { id: string; jti: string; exp: number } },
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
