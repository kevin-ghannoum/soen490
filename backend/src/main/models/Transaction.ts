'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Project } from './Project';

@Table({ timestamps: false })
export class Transaction extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  amount!: number;

  @Column
  date!: Date;

  @Column
  description!: string;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;
}
