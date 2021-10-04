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
export class Sale extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  amount!: number;

  @Column
  createdDate!: Date;

  @Column
  dueDate!: Date;

  @Column
  description!: string;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;
}
