'use strict';
import { Table, Column, Model, PrimaryKey, BelongsToMany } from 'sequelize-typescript';
import {Event} from "./Event";
import {Invited} from "./Invited";

@Table({timestamps:false})
export class Account extends Model {   
    
    @PrimaryKey
    @Column
    email!: string

    @Column
    firstName!: string

    @Column
    lastName!: string
  
    @Column
    phoneNumber!: string

    @Column
    username!: string

    @Column
    password!: string
    
    @BelongsToMany(() => Event, () => Invited)
    events?: Event[] 
};
