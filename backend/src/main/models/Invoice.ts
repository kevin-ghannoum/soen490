import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
  DataType,
  Default,
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

  @Default('PROGRESS')
  @Column(DataType.ENUM('PROGRESS', 'FINAL PAYMENT', 'DEPOSIT'))
  paymentType!: 'PROGRESS' | 'FINAL PAYMENT' | 'DEPOSIT';

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
