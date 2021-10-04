'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Account } from './Account';
import { Task } from './Task';

@Table({ timestamps: true })
export class Assigned extends Model {
  @ForeignKey(() => Task)
  @Column
  taskId!: number

  @ForeignKey(() => Account)
  @Column
  email!: string
}
