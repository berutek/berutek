import { Injectable, Inject, ServiceUnavailableException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
    @Inject('OIDC_CLIENT') private oidcClient: any,
  ) {}

  private assertOidcClient(): void {
    if (!this.oidcClient) {
      throw new ServiceUnavailableException('OIDC client is not available — check OIDC configuration');
    }
  }

  getAuthorizationUrl(state: string): string {
    this.assertOidcClient();
    return this.oidcClient.authorizationUrl({
      scope: 'openid profile email groups',
      redirect_uri: this.configService.get<string>('oidc.callbackUrl'),
      state,
    });
  }

  async handleCallback(params: any, expectedState: string) {
    this.assertOidcClient();
    const tokenSet = await this.oidcClient.callback(
      this.configService.get<string>('oidc.callbackUrl')!,
      params,
      { state: expectedState },
    );

    const userinfo = await this.oidcClient.userinfo(tokenSet);

    const user = await this.usersService.findOrCreateUser(userinfo);

    return {
      user,
      tokenSet,
    };
  }
}