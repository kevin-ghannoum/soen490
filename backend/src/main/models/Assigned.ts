'use strict';
import { Table, Column, Model, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Account } from './Account';
import { Task } from './Task';

@Table({ timestamps: false })
export class Assigned extends Model {
  @ForeignKey(() => Task)
  @PrimaryKey
  @Column
  taskId!: number;

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;
}
