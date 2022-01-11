import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

dotenv.config();
export const testing = () => {
  console.log(__dirname)
}

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'postgres',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  storage: ':memory:',
  models: [path.join(__dirname, '..', 'models', '*.ts')],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});
