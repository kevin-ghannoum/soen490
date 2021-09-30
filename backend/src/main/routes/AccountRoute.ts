// Example of a route implementation

import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import AccountRepository from '../repositories/AccountRepository';

@injectable()
export default class AccountRoute extends CommonRoutesConfig {
  // private accountService: accountService;
  private accountRepo: AccountRepository

  // Injecting registered instance of the express app (found in app.ts)
  // Notice that for userRepository, the keyword @inject was not specified because tsyringe auto inject it.
  // Useful when there is only one implementation of this class. Otherwise, you should register it in app.ts
  constructor(
    @inject('express-app') app: express.Application,
    // accountService: accountService
    accountRepo: AccountRepository
  ) {
    super(app, 'AccountRoute');
    // this.accountService = accountService;
    this.accountRepo= accountRepo;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route('/accounts')
      .get((req: express.Request, res: express.Response) => {

        //EXAMPLE
        // const test = this.accountRepo.create({ email: 'bobnewemailtesttestteassast@gmail.com', firstName: "Bob", lastName: "Bobby", phoneNumber: "514-123-1234", username: "bob123", password: "ENCRYPTED PASSWORD" })

        res
          .status(StatusCodes.OK)
          .send('Normally would return a list of accounts');
      })
    //   .post((req: express.Request, res: express.Response) => {
    //     res
    //       .status(StatusCodes.CREATED)
    //       .send('Normally this would create a new account');
    //   });

    // this.getApp()
    //   .route('/accounts/:accountEmail')
    //   // "all" keyword mean before all other request do what's inside. In this case, check if the account email is a string.
    //   //Refer to the middleware function for more detail.
    //   .all(validateAccountEmail)
    //   .get(async (req: express.Request, res: express.Response) => {
    //     const account = await this.accountService.getAccount(req.params.accountEmail);
    //     res.status(StatusCodes.OK).send(`GET requested for id ${account}`);
    //   })
    //   .put((req: express.Request, res: express.Response) => {
    //     res
    //       .status(StatusCodes.OK)
    //       .send(`PUT requested for id ${req.params.accountEmail}`);
    //   })
    //   .patch((req: express.Request, res: express.Response) => {
    //     res
    //       .status(StatusCodes.OK)
    //       .send(`PATCH requested for id ${req.params.accountEmail}`);
    //   })
    //   .delete((req: express.Request, res: express.Response) => {
    //     res
    //       .status(StatusCodes.OK)
    //       .send(`DELETE requested for id ${req.params.accountEmail}`);
    //   });

    return this.getApp();
  }
}
