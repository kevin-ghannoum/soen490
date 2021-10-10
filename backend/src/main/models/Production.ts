import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Transaction } from './Transaction';
import { Invoice } from './Invoice';

@Table({ timestamps: false })
export class Production extends Model {
  @ForeignKey(() => Transaction)
  @PrimaryKey
  @Column
  id!: number;

  @HasOne(() => Invoice)
  invoice!: Invoice;

  @BelongsTo(() => Transaction)
  transaction!: Transaction;
}
