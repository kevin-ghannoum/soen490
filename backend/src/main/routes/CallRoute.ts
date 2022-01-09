import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { CallService } from '../services/CallService';
import { checkJwt, checkRole } from '../middleware/JWTMiddleware';
import { Roles } from '../security/Roles';

@injectable()
export default class CallRoute extends CommonRoutesConfig {
  constructor(@inject('express-app') app: express.Application, private callService: CallService) {
    super(app, 'AccountRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/call`)
      .post(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newCall = await this.callService.createCall(req.body);
            res.status(StatusCodes.CREATED).send(newCall);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.ADMIN])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const calls = await this.callService.getCalls();
            res.status(StatusCodes.OK).send(calls);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/call/id/:id`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const call = await this.callService.getCallById(Number(req.params.id));
            res.status(StatusCodes.OK).send(call);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls/:callerEmail`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.ADMIN, Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])), // MAY ALLOW CLIENT TO ACCESS THIS IN THE FUTURE
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const call = await this.callService.getAllByCallerEmail(req.params.callerEmail);
            res.status(StatusCodes.OK).send(call);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/call/:id`)
      .put(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            await this.callService.updateCall(Number(req.params.id), req.body);
            res.status(StatusCodes.OK).send();
          } catch (err) {
            next(err);
          }
        }
      )
      .delete(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            await this.callService.deleteCall(Number(req.params.id));
            res.status(StatusCodes.OK).send();
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls/search/name/:receiverName`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const calls = await this.callService.searchCallsByReceiverName(req.params.receiverName);
            res.status(StatusCodes.OK).send(calls);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls/search/phoneNumber`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const calls = await this.callService.searchCallsByPhoneNumber(req.query.phoneNumber as string);
            res.status(StatusCodes.OK).send(calls);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls/search/email`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const calls = await this.callService.searchCallsByReceiverEmail(req.query.receiverEmail as string);
            res.status(StatusCodes.OK).send(calls);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/calls/search/employeeEmail`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const calls = await this.callService.searchCallsByCallerEmail(req.body.callerEmail);
            res.status(StatusCodes.OK).send(calls);
          } catch (err) {
            next(err);
          }
        }
      );

    return this.getApp();
  }
}
