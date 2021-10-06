'use strict';
import {
  Default,
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  BelongsToMany,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { ClientAccount } from './ClientAccount';
import { EmployeeAccount } from './EmployeeAccount';
import { WorksOn } from './WorksOn';
import { Task } from './Task';
import { Feedback } from './Feedback';

@Table({ timestamps: false })
export class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  description!: string;

  @Default('PENDING')
  @Column(
    DataType.ENUM(
      'BOOKED',
      'PENDING',
      'REJECTED',
      'TO BE RESCHEDULED',
      'COMPLETED'
    )
  )
  status!:
    | 'BOOKED'
    | 'PENDING'
    | 'REJECTED'
    | 'TO BE RESCHEDULED'
    | 'COMPLETED';

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

  @ForeignKey(() => ClientAccount)
  @Column
  email!: string;

  @BelongsTo(() => ClientAccount)
  clientAccount!: ClientAccount;

  @BelongsToMany(() => EmployeeAccount, () => WorksOn)
  employeeAccount!: EmployeeAccount[];

  @HasMany(() => Task)
  tasks!: Task[];
  
  @HasOne(() => Feedback)
  feedback!: Feedback;
}
