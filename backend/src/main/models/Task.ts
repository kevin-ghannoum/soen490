'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { Account } from './Account';
import { Assigned } from './Assigned';
import { Project } from './Project';

@Table({ timestamps: true })
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  description!: string;

  @Column (
    DataType.ENUM(
      'NEW',
      'ACTIVE',
      'RESOLVED',
      'CLOSED',
      'REMOVED',
    )
  )
  status!: 'NEW' | 'ACTIVE' | 'RESOLVED' | 'CLOSED' | 'REMOVED';

  @Column
  deadlineDate!: Date;

  @Column
  createDate!: Date;

  @Column
  modifiedDate!: Date;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;

  @BelongsToMany(() => Account, () => Assigned)
  accounts!: Account[];
}
