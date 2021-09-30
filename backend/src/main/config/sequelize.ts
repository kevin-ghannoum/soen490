import dotenv from "dotenv";
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { Event } from '../models/Event';
import { Invited } from '../models/Invited';

dotenv.config();

export const sequelize = new Sequelize({
    database: "badob_tech",
    dialect: 'mysql',
    host: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    storage: ':memory:',
    models: [Account, Event, Invited],
    define:{
        freezeTableName:true
    },
    logging: false
})
