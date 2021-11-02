// Example of middleware function. These functions are used to handle certain checks relating to the API request.
// For example, it could be related to the users permission, form validation, data validation... etc.
// In other words, checks before accessing more code logics.

import express from 'express';
import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../exceptions/HttpException';

const log: debug.IDebugger = debug('app:userMiddleware');

// Simple example for validating if the request param which expect and id of type number is correct.
const validateUserIdIsNumber = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (Number(req.params.userId) && Number.isInteger(Number(req.params.userId))) {
    // Next function tells Express to go the next middleware function
    next();
  } else {
    log(`User id: ${req.params.userId} is invalid`);

    // Passing the error to the next middleware which would be the httpMiddlewareError function
    // Must use "next" due to the code being asynchronous compared to throw.
    next(new HttpException(StatusCodes.BAD_REQUEST, 'User id must be an integer'));
  }
};

export { validateUserIdIsNumber };
