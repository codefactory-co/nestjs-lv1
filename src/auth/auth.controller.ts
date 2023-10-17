import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('token/access')
  async createTokenAccess(@Headers('authorization') rawToken: string) {
    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    return {
      accessToken: await this.authService.rotateToken(token, false),
    };
  }

  @Post('token/refresh')
  async createTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    return {
      refreshToken: await this.authService.rotateToken(token, true),
    };
  }

  @Post('login/email')
  async loginEmail(@Headers('authorization') rawToken: string) {
    const token = await this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = await this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(@Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password', new MaxLengthPipe(8, '비밀번호'), new MinLengthPipe(3)) password: string) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
