import { AuthenticationClient, TokenResponse } from 'auth0';
import debug from 'debug';
import { inject, injectable } from 'tsyringe';
import { BusinessAccountService } from './BusinessAccountService';
import { ClientAccountService } from './ClientAccountService';
import { EmployeeAccountService } from './EmployeeAccountService';
import { AdminAccountService } from './AdminAccountService';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

const log: debug.IDebugger = debug('app:AuthenticationService');

@injectable()
export class AuthenticationService {
  constructor(@inject('auth0-authentication-client')
  private authenticationClient: AuthenticationClient,
    private businessAccountService: BusinessAccountService,
    private clientAccountService: ClientAccountService,
    private employeeAccountService: EmployeeAccountService,
    private adminAccountService: AdminAccountService,
  ) {
    log('Created instance of AuthenticationService');
  }

  public login = async (accountInfo: { username: string; password: string }): Promise<TokenResponse> => {
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

  public getReduxAccountByRole = async (role: string, email: string): Promise<any> => {

    let response = {}

    switch (role) {
      case "BUSINESS": {
        const result = await this.businessAccountService.getRedux(email)
        response = {
          account: {
            email: result?.account.email,
            firstName: result?.account.firstName,
            lastName: result?.account.lastName,
            role: "BUSINESS",
          },
          businessAcc: {
            businessId: result?.business.id
          }
        }
        break;
      }
      case "CLIENT": {
        const result = await this.clientAccountService.getRedux(email)
        response = {
          account: {
            email: result?.account.email,
            firstName: result?.account.firstName,
            lastName: result?.account.lastName,
            role: "BUSINESS",
          },
          clientAcc: {
            website: result?.website,
            businessName: result?.businessName,
            status: result?.status,
            industry: result?.industry
          }
        }
        break;
      }
      case "EMPLOYEE": {
        const result = await this.employeeAccountService.getRedux(email)
        response = {
          account: {
            email: result?.account.email,
            firstName: result?.account.firstName,
            lastName: result?.account.lastName,
            role: "BUSINESS",
          },
          employeeAcc: {
            title: result?.title
          }
        }
        break;
      }
      case "ADMIN": {
        const result = await this.adminAccountService.getRedux(email)
        response = {
          account: {
            email: result?.account.email,
            firstName: result?.account.firstName,
            lastName: result?.account.lastName,
            role: "ADMIN",
          },
          admin: true
        }
        break;
      }
      default: {
        return Promise.reject(new HttpException(StatusCodes.BAD_REQUEST, "The role does not match with any of the existing roles."))
      }
    }

    return Promise.resolve(response);
  };
}
