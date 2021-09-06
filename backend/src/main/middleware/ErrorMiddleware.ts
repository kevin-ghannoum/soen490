import express from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../exceptions/HttpException';

const httpMiddlewareError = (
  error: HttpException,
  request: express.Request,
  response: express.Response
) => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Unexpected error';
  response.status(status).send({
    status,
    message,
  });
};

// generic handler
const failSafeHandler = (
  error: Error,
  request: express.Request,
  response: express.Response
) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
};

export { httpMiddlewareError, failSafeHandler };
