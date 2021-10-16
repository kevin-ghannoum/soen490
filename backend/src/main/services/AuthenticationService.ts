import { AuthenticationClient, ManagementClient, TokenResponse } from 'auth0';
import debug from 'debug';
import { inject, injectable } from 'tsyringe';

const log: debug.IDebugger = debug('app:AuthenticationService');

@injectable()
export class AuthenticationService {
  constructor(
    @inject('auth0-authentication-client') private authenticationClient: AuthenticationClient,
    @inject('auth0-management-client') private managementClient: ManagementClient
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
  public getProfile = async (accessToken: string) => {
    const user = await this.authenticationClient.getProfile(accessToken);
    const params ={id:user.sub, page: 0, per_page: 50, sort: 'date:-1', include_totals: true}
    console.log(await this.managementClient.getUserRoles(params))
    console.log(user.user_metadata)
    return user;
  };

  public logout = () => {};
}
