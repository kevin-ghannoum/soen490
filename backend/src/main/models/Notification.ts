'use strict';
import { Table, Column, Model, PrimaryKey, BelongsTo, DataType, ForeignKey, Default, AutoIncrement } from 'sequelize-typescript';
import { Account } from "./Account";

@Table({ timestamps: false })
export class Notification extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  date!: Date

  @Column
  message!: string

  @ForeignKey(() => Account)
  @Column
  email!: string

  @Default('GENERAL')
  @Column(DataType.ENUM('EVENT', 'SYSTEM', 'REMINDER', 'GENERAL'))
  type!: 'EVENT' | 'SYSTEM' | 'REMINDER' | 'GENERAL';

  @BelongsTo(() => Account)
  account!: Account
}
