'use strict';
import { Table, Column, Model, PrimaryKey, BelongsToMany } from 'sequelize-typescript';
import {Account} from "./Account";
import {Invited} from "./Invited";

@Table
export class Event extends Model {   
    
    @PrimaryKey
    @Column
    id!: number

    @Column
    location!: string

    @Column
    description!: string
  
    @Column
    date!: Date

    @Column
    type!: string

    @BelongsToMany(() => Account, () => Invited)
    accounts?: Account[]
};
