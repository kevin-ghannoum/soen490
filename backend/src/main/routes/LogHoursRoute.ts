import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { LogHoursService } from '../services/LogHoursService';

@injectable()
export default class LogHoursRoute extends CommonRoutesConfig {
  private logHoursService: LogHoursService;

  constructor(@inject('express-app') app: express.Application, logHoursService: LogHoursService) {
    super(app, 'AccountRoute');
    this.logHoursService = logHoursService;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/logHours`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newLogHours = await this.logHoursService.createLogHours(req.body);
          res.status(StatusCodes.CREATED).send(newLogHours);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/pay/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.logHoursService.getPaysByEmail(req.params.email);
          res.status(StatusCodes.OK).send(employeeAccount);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/pay/latest/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.logHoursService.getLatestPay(req.params.email);
          res.status(StatusCodes.OK).send(employeeAccount);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.logHoursService.getEmployeeHoursInputType(req.params.email);
          res.status(StatusCodes.OK).send(employeeAccount);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/pay/:id`)
      .put(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newLogHours = await this.logHoursService.updatePay(Number(req.params.id), req.body);
          res.status(StatusCodes.CREATED).send(newLogHours);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .put(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newLogHours = await this.logHoursService.updateEmployeeHoursInputType(req.params.email, req.body);
          res.status(StatusCodes.CREATED).send(newLogHours);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.logHoursService.deleteEmployeeHoursInputType(req.params.email);
          res.status(StatusCodes.OK).send(employeeAccount);
        } catch (err) {
          next(err);
        }
      });

    return this.getApp();
  }
}
