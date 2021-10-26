import { AuthenticationClient, ManagementClient, TokenResponse } from 'auth0';
import debug from 'debug';
import { inject, injectable } from 'tsyringe';

const log: debug.IDebugger = debug('app:AuthenticationService');

@injectable()
export class AuthenticationService {
  constructor(
    @inject('auth0-authentication-client') private authenticationClient: AuthenticationClient,
  ) {
    log('Created instance of AuthenticationService');
  }

  public login = async (accountInfo: { username: string; password: string }): Promise<TokenResponse> => {
    const data = {
      ...accountInfo,
      client_id: process.env.AUTH0_CLIENT_ID,
      realm: process.env.AUTH0_CONNECTION,
      scope: 'openid',
    };

    return this.authenticationClient.passwordGrant(data);
  };

  public logout = () => { };
}
