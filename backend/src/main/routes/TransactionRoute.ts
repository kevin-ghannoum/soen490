import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { TransactionService } from '../services/TransactionService';
import { checkJwt } from '../middleware/JWTMiddleware';
import { ExpenseService } from '../services/ExpenseService';
import { ProductionService } from '../services/ProductionService';

@injectable()
export default class TransactionRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private transactionService: TransactionService,
    private expenseService: ExpenseService,
    private productionService: ProductionService
  ) {
    super(app, 'TransactionRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/transactions/expenses`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newExpense = await this.transactionService.createTransactionExpense(req.body);
          res.status(StatusCodes.CREATED).send(newExpense);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const expensesOfProject = await this.expenseService.getAllExpensesForProjects(Number(req.query.projectId));
          res.status(StatusCodes.OK).send(expensesOfProject);
        } catch (err) {
          next(err);
        }
      })
      .put(
        checkJwt,
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            await this.transactionService.updateTransactionExpense(req.body);
            res.status(StatusCodes.OK).send('Updated');
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/transactions/productions`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newProduction = await this.transactionService.createTransactionProduction(req.body);
          res.status(StatusCodes.CREATED).send(newProduction);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const productionsOfProject = await this.productionService.getAllProductionsForProject(
            Number(req.query.projectId)
          );
          res.status(StatusCodes.OK).send(productionsOfProject);
        } catch (err) {
          next(err);
        }
      })
      .put(
        checkJwt,
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            await this.transactionService.updateTransactionProduction(req.body);
            res.status(StatusCodes.OK).send('Updated');
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/transaction/expense`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const expense = await this.expenseService.getExpense(Number(req.query.id));
          res.status(StatusCodes.OK).send(expense);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/transaction/production`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const production = await this.productionService.getProduction(Number(req.query.id));
          res.status(StatusCodes.OK).send(production);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/transaction`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await this.transactionService.deleteTransaction(Number(req.query.transactionId));
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      });

    return this.getApp();
  }
}
