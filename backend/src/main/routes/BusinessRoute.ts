import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { BusinessService } from '../services/BusinessService';
import { AuthenticationService } from '../services/AuthenticationService';
import { checkJwt, checkRole } from '../middleware/JWTMiddleware';
import { Roles } from '../security/Roles';

@injectable()
export default class BusinessRoute extends CommonRoutesConfig {

  constructor(
    @inject('express-app') app: express.Application, 
    private businessService: BusinessService,
    private authenticationService: AuthenticationService
    ) {
    super(app, 'BusinessRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/business`)
      .post(
        checkJwt,
        checkRole(new Set([Roles.ADMIN])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newBusiness = await this.businessService.createBusiness(req.body);
            res.status(StatusCodes.CREATED).send(newBusiness);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
    .route(`/business/:id`)
    .put(
      checkJwt,
      checkRole(new Set([Roles.ADMIN])),
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if(req.body.account?.password) {      
            await this.authenticationService.updatePassword(process.env.AUTH0_CONNECTION as string, req.body.account.email);
          }
          await this.businessService.updateBusiness(Number(req.params.id), req.body);
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      }
    )
    .delete(
      checkJwt,
      checkRole(new Set([Roles.ADMIN])),
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await this.businessService.deleteBusiness(Number(req.params.id));
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      }
    );

    this.getApp()
      .route(`/businesses`)
      .get(
        // checkJwt,
        // checkRole(new Set([Roles.ADMIN])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const businesses = await this.businessService.getBusinesses();
            res.status(StatusCodes.OK).send(businesses);
          } catch (err) {
            next(err);
          }
        }
      );


    return this.getApp();
  }
}
