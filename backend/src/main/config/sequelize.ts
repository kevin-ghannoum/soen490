require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';

export const sequelize = new Sequelize({
    database: "badob_tech",
    dialect: 'mysql',
    host:"localhost",
    username: "root",
    password: "",
    storage: ':memory:',
    models: ['../models'],
    define:{
        freezeTableName:true
    }
})
