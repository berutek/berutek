import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthService } from '../services/auth.service';

import { TwoFactorService } from '../../two-factor/two-factor.service';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Verify2faDto } from '../dto/verify-2fa.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Disable2faDto } from '../dto/disable-2fa.dto';
import { Enable2faDto } from '../dto/enable-2fa.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Public()
  @Post('/register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(
      dto,
      this.getIp(req),
      req.headers['user-agent'] || '',
    );
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(
      dto,
      this.getIp(req),
      req.headers['user-agent'] || '',
    );
  }

  @Public()
  @Post('/2fa/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async verify2fa(@Body() dto: Verify2faDto, @Req() req: Request) {
    return this.authService.verify2fa(
      dto,
      this.getIp(req),
      req.headers['user-agent'] || '',
    );
  }

  @Public()
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refreshTokens(
      dto.refreshToken,
      this.getIp(req),
      req.headers['user-agent'] || '',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
  ) {
    await this.authService.logout(user.sub, dto.refreshToken, this.getIp(req));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/setup')
  async setup2fa(@CurrentUser() user: JwtPayload) {
    return this.twoFactorService.generate2faSetup(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/enable')
  @HttpCode(HttpStatus.OK)
  async enable2fa(@CurrentUser() user: JwtPayload, @Body() dto: Enable2faDto) {
    return this.twoFactorService.enable2fa(user.sub, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disable2fa(@CurrentUser() user: JwtPayload, @Body() dto: Disable2faDto) {
    await this.twoFactorService.disable2fa(user.sub, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/recovery-codes/regenerate')
  async regenerateRecoveryCodes(
    @CurrentUser() user: JwtPayload,
    @Body() dto: Disable2faDto,
  ) {
    return {
      recoveryCodes: await this.twoFactorService.regenerateRecoveryCodes(
        user.sub,
        dto.password,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  private getIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}
