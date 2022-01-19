import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  storage: ':memory:',
  models: [path.join(__dirname, '..', 'models', (process.env.PRODUCTION as string) === 'true' ? '*.js' : '*.ts')],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
  dialectOptions:
    (process.env.PRODUCTION as string) === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
});
