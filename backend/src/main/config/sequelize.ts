import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

dotenv.config();
export const sequelize = new Sequelize({
  database: 'badob_tech',
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  storage: ':memory:',
  models: [path.join(__dirname, '..', 'models', '*.ts')],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
});
