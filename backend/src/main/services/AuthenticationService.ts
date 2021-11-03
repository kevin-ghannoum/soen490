import { AuthenticationClient, TokenResponse } from 'auth0';
import debug from 'debug';
import { inject, injectable } from 'tsyringe';

const log: debug.IDebugger = debug('app:AuthenticationService');

@injectable()
export class AuthenticationService {
  constructor(@inject('auth0-authentication-client') private authenticationClient: AuthenticationClient) {
    log('Created instance of AuthenticationService');
  }

  public login = async (accountInfo: { username: string; password: string; }): Promise<TokenResponse> => {
    const auth0LoginData = {
      ...accountInfo,
      client_id: process.env.AUTH0_CLIENT_ID,
      realm: process.env.AUTH0_CONNECTION,
      scope: 'offline_access',
    };

    return this.authenticationClient.passwordGrant(auth0LoginData);
  };

  public logout = async (refreshToken: string): Promise<void> => {
    const auth0LogoutData = {
      token: refreshToken,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    };

    this.authenticationClient.tokens?.revokeRefreshToken(auth0LogoutData);
  };

  public refreshTokens = async (refreshToken: string): Promise<TokenResponse> => {
    const auth0RefreshTokenData = {
      refresh_token: refreshToken,
      client_id: process.env.AUTH0_CLIENT_ID,
    };

    return this.authenticationClient.refreshToken(auth0RefreshTokenData);
  };
}
