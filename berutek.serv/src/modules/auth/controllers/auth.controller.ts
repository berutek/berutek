import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import 'express-session';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private config_service: ConfigService ,private authService: AuthService) {}

  @Get('login')
  login(@Req() req: Request, @Res() res: Response) {
    const state = randomBytes(16).toString('hex');
    req.session.oidcState = state;
    const authorizationUrl = this.authService.getAuthorizationUrl(state);
    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Session error' });
      res.redirect(authorizationUrl);
    });
  }

  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
      const expectedState = req.session.oidcState;

      if(!expectedState || req.query.state !== expectedState) {
        return res.status(400).json({ message: 'Invalid state parameter' });
      }
      const { user, tokenSet } = await this.authService.handleCallback(req.query, expectedState!);

      // Store user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        displayname: user.displayname,
        groups: user.groups,
      };

      res.redirect(this.config_service.get('oidc.frontendUrl')!);
    } catch (error) {
      console.error('OIDC callback error:', error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.redirect('https://login.berutek.dev/logout');
    });
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req.session.user) {
      return { message: 'Not authenticated' };
    }
    return req.session.user;
  }
}