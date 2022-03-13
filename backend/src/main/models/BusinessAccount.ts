import { BelongsTo, Column, ForeignKey, HasOne,  Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Account } from './Account';
import { Business } from './Business';

@Table({ timestamps: false })
export class BusinessAccount extends Model {
  @BelongsTo(() => Account)
  account!: Account;

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;

  @HasOne(() => Business)
  business!: Business;
}
