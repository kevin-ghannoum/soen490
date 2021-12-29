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
  HasOne,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { ClientAccount } from './ClientAccount';
import { EmployeeAccount } from './EmployeeAccount';
import { WorksOn } from './WorksOn';
import { Task } from './Task';
import { Feedback } from './Feedback';

import { Sale } from './Sale';
import { Transaction } from './Transaction';
import { Business } from './Business';

@Table({ timestamps: false })
export class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @AllowNull
  @Column
  description!: string;

  @Default('PENDING')
  @Column(DataType.ENUM('BOOKED', 'PENDING', 'REJECTED', 'TO BE RESCHEDULED', 'COMPLETED', 'ARCHIVED'))
  status!: 'BOOKED' | 'PENDING' | 'REJECTED' | 'TO BE RESCHEDULED' | 'COMPLETED' | 'ARCHIVED';

  @AllowNull
  @Column
  serviceType!: string;

  @AllowNull
  @Column
  leadSource!: string;

  @AllowNull
  @Column
  leadCredit!: string;

  @AllowNull
  @Column
  leadRanking!: string;

  @Column
  createdDate!: Date;

  @Column
  deadlineDate!: Date;

  @AllowNull
  @Column
  followUpDate!: Date;

  @Column
  modifiedDate!: Date;

  @AllowNull
  @Column
  extraNotes!: string;

  @ForeignKey(() => ClientAccount)
  @Column
  email!: string;

  @ForeignKey(() => Business)
  @Column
  businessId!: number;

  @BelongsTo(() => ClientAccount)
  clientAccount!: ClientAccount;

  @BelongsToMany(() => EmployeeAccount, () => WorksOn)
  employeeAccount!: EmployeeAccount[];

  @HasMany(() => Task)
  tasks!: Task[];

  @HasOne(() => Feedback)
  feedback!: Feedback;

  @HasOne(() => Sale)
  sale!: Sale;

  @HasMany(() => Transaction)
  transaction!: Transaction[];
}
