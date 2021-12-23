import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { AuthenticationService } from '../services/AuthenticationService';
import { TokenResponse } from 'auth0';
import HttpException from '../exceptions/HttpException';
import { checkJwt } from '../middleware/JWTMiddleware';

@injectable()
export default class AuthenticationRoute extends CommonRoutesConfig {
  private authenticationService: AuthenticationService;

  constructor(@inject('express-app') app: express.Application, authenticationService: AuthenticationService) {
    super(app, 'AuthenticationRoute');
    this.authenticationService = authenticationService;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route('/auth/login')
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const token: TokenResponse = await this.authenticationService.login({
            username: req.body.email,
            password: req.body.password,
          });
          res.status(StatusCodes.ACCEPTED).send(token);
        } catch (err: any) {
          if (err.statusCode === StatusCodes.FORBIDDEN) {
            next(new HttpException(StatusCodes.FORBIDDEN, err));
          } else {
            next(err);
          }
        }
      });

    this.getApp()
      .route('/auth/logout')
      .delete(checkJwt, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await this.authenticationService.logout(req.query.refresh_token as string);
          res.status(StatusCodes.ACCEPTED).send();
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route('/auth/refreshTokens')
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const token: TokenResponse = await this.authenticationService.refreshTokens(req.body.refresh_token);
          res.status(StatusCodes.ACCEPTED).send(token);
        } catch (err) {
          next(err);
        }
      });
    return this.getApp();
  }
}
