import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import express from 'express';
import { container } from 'tsyringe';
import { AuthenticationClient, ManagementClient, Role } from 'auth0';
import { Roles } from '../security/Roles';
import HttpException from '../exceptions/HttpException';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
dotenv.config();
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt: jwt.RequestHandler = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export const checkRole = (
  accessRole: Set<Roles>
): ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const userRoles: Role[] = await getProfileRoles(req.headers['access_token'] as string);

    for (let i: number = 0; i < userRoles.length; i++) {
      if (accessRole.has((<any>Roles)[userRoles[i].name as string])) {
        next();
        break;
      }

      if (i === userRoles.length - 1) {
        next(new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));
      }
    }
  };
};

const getProfileRoles = async (accessToken: string): Promise<Role[]> => {
  const authenticationClient: AuthenticationClient = container.resolve('auth0-authentication-client');
  const managementClient: ManagementClient = container.resolve('auth0-management-client');

  const user: any = await authenticationClient.getProfile(accessToken);
  const params = { id: user.sub, page: 0, per_page: 50, sort: 'date:-1', include_totals: true };
  3;
  const roles: any = (await managementClient.getUserRoles(params)) as any;
  return Promise.resolve(roles.roles);
};
