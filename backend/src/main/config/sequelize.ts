import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { Business } from '../models/Business';
import { EmailTemplate } from '../models/EmailTemplate';
import { Event } from '../models/Event';
import { Expense } from '../models/Expense';
import { Goal } from '../models/Goal';
import { Invited } from '../models/Invited';
import { Invoice } from '../models/Invoice';
import { Production } from '../models/Production';
import { Project } from '../models/Project';
import { Sale } from '../models/Sale';
import { Transaction } from '../models/Transaction';

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
  logging: true,
});
