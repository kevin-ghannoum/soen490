import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { AuthenticationService } from '../services/AuthenticationService';
import { checkJwt } from '../middleware/JWTMiddleware';
import { TokenResponse } from 'auth0';

@injectable()
export default class AuthenticationRoute extends CommonRoutesConfig {
  private authenticationService: AuthenticationService;

  constructor(@inject('express-app') app: express.Application, authenticationService: AuthenticationService) {
    super(app, 'AuthenticationRoute');
    this.authenticationService = authenticationService;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route('/login')
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const token: TokenResponse = await this.authenticationService.login({
            username: req.body.email,
            password: req.body.password,
          });
          res.status(StatusCodes.ACCEPTED).send(token);
        } catch (err) {
          next(err);
        }
      });
    return this.getApp();
  }
}
