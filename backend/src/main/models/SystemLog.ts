'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ timestamps: true })
export class SystemLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  description!: string;

  @Column
  date!: Date;

  @Column
  type!: string;
}
