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
import { Production } from './Production';

@Table({ timestamps: false })
export class Invoice extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  totalAmount!: number;

  @Column
  quantity!: number;

  @Column
  date!: Date;

  @Column
  description!: string;

  @ForeignKey(() => Production)
  @Column
  productionId!: number;

  @BelongsTo(() => Production)
  production!: Production;
}
