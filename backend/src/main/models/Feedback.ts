'use strict';
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Project } from './Project';

@Table({ timestamps: true })
export class Feedback extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  comment!: string;

  @Column
  rating!: number;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;
}
