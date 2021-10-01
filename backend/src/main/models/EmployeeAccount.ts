import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Account } from './Account';

@Table({ timestamps: false })
export class EmployeeAccount extends Model {
  @BelongsTo(() => Account)
  account!: Account;

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  hourlyWage!: number;

  @HasMany(() => EmployeeAccount, 'email')
  subordinate!: EmployeeAccount[];

  @ForeignKey(() => EmployeeAccount)
  @Column
  supervisorEmail!: string;

  @BelongsTo(() => EmployeeAccount, 'supervisorEmail')
  supervisor!: EmployeeAccount;
}
