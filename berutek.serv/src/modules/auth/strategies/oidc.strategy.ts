import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Issuer, type Client } from 'openid-client';
import { UserService } from '../../users/services/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  constructor(client: Client, private usersService: UserService) {
    super({ client });
  }

  async validate(tokenSet: any) {
    const userinfo = tokenSet.claims();

    const user = await this.usersService.findOrCreateUser(userinfo);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayname: user.displayname,
      groups: user.groups,
      sub: userinfo.sub,
    };
  }
}

export async function initializeOidcClient(configService: ConfigService) {
  const issuerUrl = configService.get<string>('oidc.issuerUrl');
  if (!issuerUrl) throw new Error('OIDC_ISSUER_URL is not configured');

  const authelia = await Issuer.discover(issuerUrl);

  const client = new authelia.Client({
    client_id: configService.get<string>('oidc.clientId')!,
    client_secret: configService.get<string>('oidc.clientSecret'),
    redirect_uris: [configService.get<string>('oidc.callbackUrl')!],
    response_types: ['code'],
  });

  return client;
}