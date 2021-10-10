// Example of a route implementation

import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { UserService } from '../services/UserService';
import { validateUserIdIsNumber } from '../middleware/UserMiddleware';

@injectable()
export default class UserRoute extends CommonRoutesConfig {
  private userService: UserService;

  // Injecting registered instance of the express app (found in app.ts)
  // Notice that for userRepository, the keyword @inject was not specified because tsyringe auto inject it.
  // Useful when there is only one implementation of this class. Otherwise, you should register it in app.ts
  constructor(@inject('express-app') app: express.Application, userService: UserService) {
    super(app, 'UserRoute');
    this.userService = userService;
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route('/users')
      .get((req: express.Request, res: express.Response) => {
        res.status(StatusCodes.OK).send('Normally would return a list of users');
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(StatusCodes.CREATED).send('Normally this would create a new user');
      });

    this.getApp()
      .route('/users/:userId')
      // "all" keyword mean before all other request do what's inside. In this case, check if the user id is a number.
      //Refer to the middleware function for more detail.
      .all(validateUserIdIsNumber)
      .get(async (req: express.Request, res: express.Response) => {
        const user = await this.userService.getUser(req.params.userId);
        res.status(StatusCodes.OK).send(`GET requested for id ${user}`);
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(StatusCodes.OK).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(StatusCodes.OK).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(StatusCodes.OK).send(`DELETE requested for id ${req.params.userId}`);
      });

    return this.getApp();
  }
}
