'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
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

  @Default('SYSTEM')
  @Column(
    DataType.ENUM(
      'SYSTEM',
      'APP',
      'OTHER',
    ))
  type!: 'SYSTEM' | 'APP' | 'OTHER';
}
