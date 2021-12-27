import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Account } from './Account';
import { Business } from './Business';
import { Pay } from './Pay';
import { Project } from './Project';
import { WorksOn } from './WorksOn';

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

  @HasMany(() => EmployeeAccount)
  subordinate!: EmployeeAccount[];

  @ForeignKey(() => EmployeeAccount)
  @Column
  supervisorEmail!: string;

  @ForeignKey(() => Business)
  @Column
  businessId!: number;

  @BelongsTo(() => Business)
  business!: Business;

  @BelongsTo(() => EmployeeAccount, 'supervisorEmail')
  supervisor!: EmployeeAccount;

  @HasMany(() => Pay)
  pays!: Pay[];

  @BelongsToMany(() => Project, () => WorksOn)
  projects!: Project[];
}
