import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { AdminAccount } from '../models/AdminAccount';
import { BusinessAccount } from '../models/BusinessAccount';
import { ClientAccount } from '../models/ClientAccount';
import { EmployeeAccount } from '../models/EmployeeAccount';
import { Event } from '../models/Event';
import { Invited } from '../models/Invited';
import { Project } from '../models/Project';
import { SocialMediaPage } from '../models/SocialMediaPage';

dotenv.config();
export const sequelize = new Sequelize({
  database: 'badob_tech',
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  storage: ':memory:',
  models: [Account, Event, Invited, ClientAccount, Project, EmployeeAccount, AdminAccount, BusinessAccount, SocialMediaPage],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
});
