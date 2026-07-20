import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUseCase } from '../application/use-cases/login/login.use-case';
import { LoginRequest } from './requests/login.request';
import { RegisterUseCase } from '../application/use-cases/register/register.use-case';
import { RegisterRequest } from './requests/register.request';
import { JwtAuthGuard } from '../../../shared/http/guards/jwt-auth.guard';
import { LogoutUseCase } from '../application/use-cases/logout/logout.use-case';
import { type Request, type Response } from 'express';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token/refresh-token.use-case';
import { OAuthLoginUseCase } from '../application/use-cases/oauth-login/oauth-login.use-case';
import passport from 'passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  public constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly oAuthLoginUseCase: OAuthLoginUseCase,
  ) {}

  @Post('/login')
  public async login(
    @Body() request: LoginRequest,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.loginUseCase.execute(request);

    if (!result) {
      return response.status(401).json({ message: 'Login failed' });
    }

    const { accessToken, refreshToken, roleId } = result;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    response.cookie('user_role', roleId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.json({ accessToken });
  }

  @Post('/register')
  public async register(
    @Body() request: RegisterRequest,
  ): Promise<{ tempToken: string }> {
    return await this.registerUseCase.execute(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  public async logout(
    @Req()
    request: {
      user: { userId: string; jti: string; sessionId: string; exp: number };
    },
    @Res() response: Response,
  ): Promise<any> {
    await this.logoutUseCase.execute(
      request.user.userId,
      request.user.jti,
      request.user.exp,
      request.user.sessionId,
    );

    response.clearCookie('refresh_token');
    response.clearCookie('user_role');
    return response.json({ message: 'Logged out' });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  public async googleAuth(): Promise<void> {}

  @Get('google/callback')
  public async googleAuthCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';

    try {
      await new Promise<void>((resolve, reject) => {
        passport.authenticate(
          'google',
          { session: false },
          (err: any, user: any) => {
            if (err || !user) {
              reject(err || new Error('OAuth authentication failed'));
              return;
            }
            request.user = user;
            resolve();
          },
        )(request, response, () => resolve());
      });
    } catch (error) {
      this.logger.warn(
        `Google OAuth callback failed: ${error instanceof Error ? error.message : error}`,
      );

      if (!response.headersSent) {
        response.redirect(`${frontendUrl}/`);
      }

      return;
    }

    const profile = request.user as any;

    const result = await this.oAuthLoginUseCase.execute({
      provider: profile.provider,
      providerId: profile.providerId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    });

    if (!result) {
      if (!response.headersSent) {
        response.redirect(`${frontendUrl}/login`);
      }
      return;
    }

    const { accessToken, refreshToken, roleId, isNewUser } = result;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('user_role', roleId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (isNewUser) {
      return response.redirect(
        `${frontendUrl}/account/complete-information?token=${accessToken}`,
      );
    }

    return response.redirect(`${frontendUrl}/?token=${accessToken}`);
  }

  @Post('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      return response.status(401).json({ message: 'No refresh token' });
    }

    return response.send(await this.refreshTokenUseCase.execute(refreshToken));
  }
}
