import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { AdminAccount } from '../models/AdminAccount';
import { BusinessAccount } from '../models/BusinessAccount';
import { ClientAccount } from '../models/ClientAccount';
import { EmployeeAccount } from '../models/EmployeeAccount';
import { Event } from '../models/Event';
import { Invited } from '../models/Invited';
import { Pay } from '../models/Pay';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { Call } from '../models/Call';
import { Address } from '../models/Address';
import { SocialMediaPage } from '../models/SocialMediaPage';
import { WorksOn } from '../models/WorksOn';
import { Task } from '../models/Task';
import { Assigned } from '../models/Assigned';
import { Feedback } from '../models/Feedback';

dotenv.config();
export const sequelize = new Sequelize({
  database: 'badob_tech',
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  storage: ':memory:',
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
    Task,
    Assigned,
    Feedback
  ],
  define: {
    freezeTableName: true,
  },
  logging: process.env.DEBUG ? true : false,
});
