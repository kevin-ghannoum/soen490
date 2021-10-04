import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { AdminAccount } from '../models/AdminAccount';
import { BusinessAccount } from '../models/BusinessAccount';
import { ClientAccount } from '../models/ClientAccount';
import { EmployeeAccount } from '../models/EmployeeAccount';
import { Event } from '../models/Event';
import { Expense } from '../models/Expense';
import { Goal } from '../models/Goal';
import { Invited } from '../models/Invited';
import { Pay } from '../models/Pay';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { Call } from '../models/Call';
import { Address } from '../models/Address';
import { SocialMediaPage } from '../models/SocialMediaPage';
import { WorksOn } from '../models/WorksOn';
import { Invoice } from '../models/Invoice';
import { Production } from '../models/Production';
import { Sale } from '../models/Sale';
import { Transaction } from '../models/Transaction';
import { EmailTemplate } from '../models/EmailTemplate';
import { Business } from '../models/Business';

dotenv.config();
export const sequelize = new Sequelize({
  database: 'badob_tech',
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  models: [
    Account,
    Event,
    Invited,
    Project,
    Notification,
    Call,
    Address,
    ClientAccount,
    EmployeeAccount,
    AdminAccount,
    BusinessAccount,
    SocialMediaPage,
    Pay,
    WorksOn,
    Business,
    EmailTemplate,
    Goal,
    Sale,
    Invoice,
    Production,
    Expense,
    Transaction,
    Project,
  ],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
});
