import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import HttpException from '../exceptions/HttpException';
import { BusinessAccountService } from '../services/BusinessAccountService';
import { ClientAccountService } from '../services/ClientAccountService';
import { EmployeeAccountService } from '../services/EmployeeAccountService';
import { AuthenticationService } from '../services/AuthenticationService';
import { ClientAccount } from '../models/ClientAccount';
import { checkJwt, getProfileRoles, checkRole } from '../middleware/JWTMiddleware';
import jwt_decode from 'jwt-decode';
import { Role } from 'auth0';
import { Roles } from '../security/Roles';

@injectable()
export default class AccountRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private employeeAccountService: EmployeeAccountService,
    private businessAccountService: BusinessAccountService,
    private clientAccountService: ClientAccountService,
    private authenticationService: AuthenticationService
  ) {
    super(app, 'AccountRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/accounts/employee`)
      .post(checkJwt, checkRole(new Set([Roles.BUSINESS])), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newEmployeeAccount = await this.employeeAccountService.createEmployeeAccount(req.body);
          const dto = JSON.parse(JSON.stringify(newEmployeeAccount));
          delete dto.account.password;
          res.status(StatusCodes.CREATED).send(dto);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const regexEmployeeAccount = await this.employeeAccountService.getEmployeesByRegex(String(req.query.email));
          res.status(StatusCodes.OK).send(regexEmployeeAccount);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/allEmployees`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.ADMIN])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
        }
      );

    this.getApp()
      .route(`/accounts/allEmployees/:business`)
      .get(
        checkJwt,
        checkRole(new Set([Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
        }
      );

    this.getApp()
      .route(`/accounts/employee/:email`)
      .all(checkJwt, checkRole(new Set([Roles.EMPLOYEE, Roles.BUSINESS])))
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const authorizationToken: string = req.headers['authorization'] as string;
          const id_token: string = authorizationToken.split(' ')[1];
          const access_token: string = req.headers['access_token'] as string;

          const employeeAccount = await this.employeeAccountService.getEmployeeAccountByEmail(
            req.params.email,
            access_token,
            id_token
          );
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
          const authorizationToken: string = req.headers['authorization'] as string;
          const id_token: string = authorizationToken.split(' ')[1];
          const access_token: string = req.headers['access_token'] as string;

          if (
            (await this.employeeAccountService.deleteEmployeeAccountByEmail(
              req.params.email,
              access_token,
              id_token
            )) === 1
          ) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/accounts/client`)
      .all(checkJwt)
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
      .post(
        checkJwt,
        checkRole(new Set([Roles.ADMIN])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const newBusinessAccount = await this.businessAccountService.createBusinessAccount(req.body);
            const dto = JSON.parse(JSON.stringify(newBusinessAccount));
            delete dto.account.password;
            res.status(StatusCodes.CREATED).send(dto);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/accounts/business/:email`)
      .all(checkJwt, checkRole(new Set([Roles.ADMIN, Roles.BUSINESS])))
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const authorizationToken: string = req.headers['authorization'] as string;
          const token: string = authorizationToken.split(' ')[1];
          const businessAccount = await this.businessAccountService.getBusinessAccountByEmail(req.params.email, token);
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
          const authorizationToken: string = req.headers['authorization'] as string;
          const token: string = authorizationToken.split(' ')[1];
          if ((await this.businessAccountService.deleteBusinessAccountByEmail(req.params.email, token)) === 1) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
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
      .all(checkJwt, checkRole(new Set([Roles.EMPLOYEE, Roles.CLIENT, Roles.BUSINESS])))
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const authorizationToken: string = req.headers['authorization'] as string;
          const id_token: string = authorizationToken.split(' ')[1];
          const access_token: string = req.headers['access_token'] as string;

          const clientAccount: ClientAccount | null = await this.clientAccountService.getClientAccountByEmail(
            req.params.email,
            access_token,
            id_token
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
          const authorizationToken: string = req.headers['authorization'] as string;
          const id_token: string = authorizationToken.split(' ')[1];
          const access_token: string = req.headers['access_token'] as string;

          await this.clientAccountService.deleteClientAccountByEmail(req.params.email, access_token, id_token);
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/redux/accounts/`)
      .get(checkJwt, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //receive the header authorization
        const authHeader = req.headers.authorization;
        const userRole: Role[] = await getProfileRoles(req.headers['access_token'] as string);
        if (authHeader && userRole.length > 0) {
          const jwtToken = authHeader.replace('Bearer ', '');
          try {
            const decoded = JSON.parse(JSON.stringify(jwt_decode(jwtToken)));
            const response = await this.authenticationService.getReduxAccountByRole(
              userRole[0].name as string,
              decoded.email
            );
            res.status(StatusCodes.OK).send(response);
          } catch (err) {
            next(err);
          }
        } else {
          next(new HttpException(StatusCodes.BAD_REQUEST, 'The user does not have a role.'));
        }
      });

    return this.getApp();
  }
}
