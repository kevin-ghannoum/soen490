import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { ClientAccount } from '../models/ClientAccount';
import { Event } from '../models/Event';
import { Invited } from '../models/Invited';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { Call } from '../models/Call';
import { Address } from '../models/Address';

dotenv.config();
export const sequelize = new Sequelize({
    database: "badob_tech",
    dialect: 'mysql',
    host: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    storage: ':memory:',
    models: [Account, Event, Invited, Project, Notification, Call, Address, ClientAccount],
    define: {
        freezeTableName: true
    },
    logging: process.env.DEBUG ? true : false,
})
