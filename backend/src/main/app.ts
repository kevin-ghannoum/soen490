import 'reflect-metadata';
import express from 'express';
import { AppSettings } from './config/AppSettings';
import { CommonRoutesConfig } from './routes/CommonRoutesConfig';
import debug from 'debug';
import cors from 'cors';
import * as expressWinston from 'express-winston';
import UserRoute from './routes/UserRoute';
import AccountRoute from './routes/AccountRoute';
import { container } from 'tsyringe';
import { failSafeHandler, httpMiddlewareError } from './middleware/ErrorMiddleware';
import { sequelize } from './config/sequelize';

const main = async () => {
  sequelize.authenticate().then(() => console.log('Authenticated on Sequelize'));

  const app: express.Application = express();

  const port = process.env.PORT || AppSettings.BACKEND_PORT;

  const routes: Array<CommonRoutesConfig> = [];

  const debugLog: debug.IDebugger = debug('app');

  // here we are adding middleware to parse all incoming requests as JSON
  app.use(express.json());

  // here we are adding middleware to allow cross-origin requests
  app.use(cors());

  if (!process.env.DEBUG) {
    AppSettings.loggerOptions.meta = false; // when not debugging, log requests as one-liners
  }

  // initialize the logger with the above configuration
  app.use(expressWinston.logger(AppSettings.loggerOptions));

  // Registering express app to tsyringe. This allows it to be injected in other classes.
  // For express-app i used "useFactory" instead of "useValue" because with useFactory you can't clear it.
  container.register<express.Application>('express-app', {
    useFactory: () => app,
  });

  // Instanciating the routes here:
  routes.push(container.resolve(UserRoute));
  routes.push(container.resolve(AccountRoute));

  // Registering express error handling middleware
  app.use(httpMiddlewareError);
  app.use(failSafeHandler);

  app.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
      debugLog(`Routes configured for ${route.getName()}`);
    });

    console.log(`Server started on port ${port}`);
  });
};

// App starting point
main().catch((err) => {
  // Catch any unexpected error
  console.error(err);
});
