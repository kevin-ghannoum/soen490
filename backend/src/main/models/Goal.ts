'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  Default,
  DataType,
} from 'sequelize-typescript';
import { Business } from './Business';

@Table({ timestamps: false })
export class Goal extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  value!: number;

  @Column
  deadline!: Date;

  @Default('SALES')
  @Column(DataType.ENUM('SALES', 'EXPENSES', 'REJECTED'))
  type!: 'SALES' | 'EXPENSES' | 'REJECTED';

  @ForeignKey(() => Business)
  @Column
  businessId!: number;

  @BelongsTo(() => Business)
  business!: Business;
}
