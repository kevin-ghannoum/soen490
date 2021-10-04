'use strict';
import {
  Default,
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Sale } from './Sale';
import { Transaction } from './Transaction';

@Table({ timestamps: false })
export class Project extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  description!: string;

  @Default('PENDING')
  @Column(DataType.ENUM('BOOKED', 'PENDING', 'REJECTED', 'TO BE RESCHEDULED'))
  status!: 'BOOKED' | 'PENDING' | 'REJECTED' | 'TO BE RESCHEDULED';

  @Column
  serviceType!: string;

  @Column
  leadSource!: string;

  @Column
  leadCredit!: string;

  @Column
  leadRanking!: string;

  @Column
  createdDate!: Date;

  @Column
  deadlineDate!: Date;

  @Column
  followUpDate!: Date;

  @Column
  modifiedDate!: Date;

  @Column
  extraNotes!: string;

  @HasOne(() => Sale)
  sale!: Sale;

  @HasMany(() => Transaction)
  transaction!: Transaction[];
}
