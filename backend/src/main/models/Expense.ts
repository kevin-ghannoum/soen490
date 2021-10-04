import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Transaction } from './Transaction';

@Table({ timestamps: false })
export class Expense extends Model {
  @ForeignKey(() => Transaction)
  @PrimaryKey
  @Column
  id!: number;

  @Default('WAGES')
  @Column(DataType.ENUM('TOOLS', 'OTHER', 'WAGES'))
  type!: 'WAGES' | 'TOOLS' | 'OTHER';

  @BelongsTo(() => Transaction)
  transaction!: Transaction;
}
