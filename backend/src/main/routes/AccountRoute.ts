import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { EmployeeAccountService } from '../services/EmployeeAccountService';
import HttpException from '../exceptions/HttpException';
import { BusinessAccountService } from '../services/BusinessAccountService';
import { ClientAccountService } from '../services/ClientAccountService';
import { ClientAccount } from '../models/ClientAccount';
import { checkJwt } from '../middleware/JWTMiddleware';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';

@injectable()
export default class AccountRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private employeeAccountService: EmployeeAccountService,
    private businessAccountService: BusinessAccountService,
    private clientAccountService: ClientAccountService
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
      .route(`/accounts/allEmployees`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccounts = await this.employeeAccountService.getAllEmployeeAccounts();
          if (employeeAccounts === null || employeeAccounts.length === 0) {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          } else {
            const employeeAccountsDTOs: Array<any> = [];
            employeeAccounts?.forEach((employeeAccount) => {
              const dto = JSON.parse(JSON.stringify(employeeAccount));
              delete dto.account.password;
              employeeAccountsDTOs.push(dto);
            });
            res.status(StatusCodes.OK).send(employeeAccountsDTOs);
          }
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/allEmployees/:business`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccounts = await this.employeeAccountService.getAllEmployeeAccountsByBusiness(
            req.params.business
          );

          if (employeeAccounts === null || employeeAccounts.length === 0) {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          } else {
            const employeeAccountsDTOs: Array<any> = [];
            employeeAccounts?.forEach((employeeAccount) => {
              const dto = JSON.parse(JSON.stringify(employeeAccount));
              delete dto.account.password;
              employeeAccountsDTOs.push(dto);
            });
            res.status(StatusCodes.OK).send(employeeAccountsDTOs);
          }
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/employee/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const employeeAccount = await this.employeeAccountService.getEmployeeAccountByEmail(req.params.email);
          if (employeeAccount === null) {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          } else {
            const dto = JSON.parse(JSON.stringify(employeeAccount));
            delete dto.account.password;
            res.status(StatusCodes.OK).send(dto);
          }
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
      .route(`/accounts/employee`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const regexEmployeeAccount = await this.employeeAccountService.getEmployeesByRegex(String(req.query.email));
          res.status(StatusCodes.OK).send(regexEmployeeAccount);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/client`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const regexClientAccout = await this.clientAccountService.getEmployeesByRegex(String(req.query.email));
          res.status(StatusCodes.OK).send(regexClientAccout);
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
          if (businessAccount === null) {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          } else {
            const dto = JSON.parse(JSON.stringify(businessAccount));
            delete dto.account.password;
            res.status(StatusCodes.OK).send(dto);
          }
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if ((await this.businessAccountService.deleteBusinessAccountByEmail(req.params.email)) === 1) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/redux/accounts/business/`)
      .get(checkJwt, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //receive the header authorization
        const authHeader = req.headers.authorization;

        if (authHeader) {
          console.log('hi');
          const jwtToken = authHeader.replace('Bearer ', '');
          console.log(jwtToken);
          try {
            console.log('gi');
            const decoded = JSON.parse(JSON.stringify(jwt_decode(jwtToken)));
            const ress = await this.businessAccountService.getRedux(decoded.email)
            console.log(ress)
            res.status(StatusCodes.OK).send(res);
          } catch (err) {
            // err
          }
        }
      });

    this.getApp()
      .route(`/accounts/client`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const clientAccount: ClientAccount = await this.clientAccountService.createClientAccount(req.body);
          const dto = JSON.parse(JSON.stringify(clientAccount));
          delete dto.account.password;
          res.status(StatusCodes.CREATED).send(dto);
        } catch (err) {
          next(err);
        }
      });
    this.getApp()
      .route(`/accounts/client/:email`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const clientAccount: ClientAccount | null = await this.clientAccountService.getClientAccountByEmail(
            req.params.email
          );
          if (clientAccount === null) {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          } else {
            const dto = JSON.parse(JSON.stringify(clientAccount));
            delete dto.account.password;
            res.status(StatusCodes.OK).send(dto);
          }
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await this.clientAccountService.deleteClientAccountByEmail(req.params.email);
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      });
    return this.getApp();
  }
}
