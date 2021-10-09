// Example of a route implementation

import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { EmployeeAccountService } from '../services/EmployeeAccountService';
import HttpException from '../exceptions/HttpException';

@injectable()
export default class AccountRoute extends CommonRoutesConfig {
  private employeeAccountService: EmployeeAccountService;

  constructor(@inject('express-app') app: express.Application, employeeAccountService: EmployeeAccountService) {
    super(app, 'AccountRoute');
    this.employeeAccountService = employeeAccountService;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/accounts/employee`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newEmployeeAccount = await this.employeeAccountService.createEmployeeAccount(req.body);
          res.status(StatusCodes.CREATED).send(newEmployeeAccount);
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

    return this.getApp();
  }
}
