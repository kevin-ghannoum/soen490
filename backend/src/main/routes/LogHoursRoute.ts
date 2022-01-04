import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { LogHoursService } from '../services/LogHoursService';
import { checkJwt, checkRole } from '../middleware/JWTMiddleware';
import { Roles } from '../security/Roles';

@injectable()
export default class LogHoursRoute extends CommonRoutesConfig {
  constructor(@inject('express-app') app: express.Application, private logHoursService: LogHoursService) {
    super(app, 'AccountRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/logHours`)
      .post(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newLogHours = await this.logHoursService.createLogHours(req.body);
            res.status(StatusCodes.CREATED).send(newLogHours);
          } catch (err) {
            next(err);
          }
        }
      );

      this.getApp()
        .route(`/logHours`)
        .get(
          checkJwt,
          checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
          async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
              const employeeAccount = await this.logHoursService.getAllBusinessPays(Number(req.query.businessId));
              res.status(StatusCodes.OK).send(employeeAccount);
            } catch (err) {
              next(err);
            }
          }
        );

    this.getApp()
      .route(`/logHours/pay/:email`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const employeeAccount = await this.logHoursService.getPaysByEmail(req.params.email);
            res.status(StatusCodes.OK).send(employeeAccount);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/logHours/pay/latest/:email`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const employeeAccount = await this.logHoursService.getLatestPay(req.params.email);
            res.status(StatusCodes.OK).send(employeeAccount);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const employeeAccount = await this.logHoursService.getEmployeeHoursInputType(req.params.email);
            res.status(StatusCodes.OK).send(employeeAccount);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/logHours/pay/:id`)
      .put(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newLogHours = await this.logHoursService.updatePay(Number(req.params.id), req.body);
            res.status(StatusCodes.CREATED).send(newLogHours);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .put(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newLogHours = await this.logHoursService.updateEmployeeHoursInputType(req.params.email, req.body);
            res.status(StatusCodes.CREATED).send(newLogHours);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/logHours/inputType/:email`)
      .delete(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const employeeAccount = await this.logHoursService.deleteEmployeeHoursInputType(req.params.email);
            res.status(StatusCodes.OK).send(employeeAccount);
          } catch (err) {
            next(err);
          }
        }
      );

    return this.getApp();
  }
}
