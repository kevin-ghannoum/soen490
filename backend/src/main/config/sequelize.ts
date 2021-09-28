require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';

export const sequelize = new Sequelize({
    repositoryMode: true,
    database: "badob_tech",
    dialect: 'mysql',
    username: "127.0.0.1",
    password: "mysqlpw",
    storage: ':memory:',
    models: [Account]
})
