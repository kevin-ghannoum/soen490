// Example of a route implementation

import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { EmployeeAccountService } from '../services/EmployeeAccountService';
import HttpException from '../exceptions/HttpException';
import { BusinessAccountService } from '../services/BusinessAccountService';

@injectable()
export default class AccountRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private employeeAccountService: EmployeeAccountService,
    private businessAccountService: BusinessAccountService
  ) {
    super(app, 'AccountRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/accounts/employee`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newEmployeeAccount = await this.employeeAccountService.createEmployeeAccount(req.body);
          const dto = JSON.parse(JSON.stringify(newEmployeeAccount));
          delete dto.account.password;
          res.status(StatusCodes.CREATED).send(dto);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/employee/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.employeeAccountService.getEmployeeAccountByEmail(req.params.email);
          res.status(StatusCodes.OK).send(employeeAccount);
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if ((await this.employeeAccountService.deleteEmployeeAccountByEmail(req.params.email)) === 1) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/business`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newBusinessAccount = await this.businessAccountService.createBusinessAccount(req.body);
          const dto = JSON.parse(JSON.stringify(newBusinessAccount));
          delete dto.account.password;
          res.status(StatusCodes.CREATED).send(dto);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/business/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const businessAccount = await this.businessAccountService.getBusinessAccountByEmail(req.params.email);
          // Sending full entity for now. Might switch to dto
          res.status(StatusCodes.OK).send(businessAccount);
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if ((await this.businessAccountService.deleteEmployeeAccountByEmail(req.params.email)) === 1) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
        }
      });

    return this.getApp();
  }
}
