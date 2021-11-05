import { Table, Column, Model, PrimaryKey, BelongsTo, ForeignKey, AutoIncrement } from 'sequelize-typescript';
import { Account } from './Account';

@Table({ timestamps: false })
export class Call extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  date!: Date;

  @Column
  receiverName!: string;

  @Column
  phoneNumber!: string;

  @Column
  description!: string;

  @ForeignKey(() => Account)
  @Column
  email!: string;

  @BelongsTo(() => Account)
  account!: Account;
}
