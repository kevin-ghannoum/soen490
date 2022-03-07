import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { Account } from './Account';
import { Invited } from './Invited';

@Table({ timestamps: false })
export class Event extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull
  @Column
  location!: string;

  @AllowNull
  @Column
  description!: string;

  @AllowNull(false)
  @Column
  start!: string;

  @AllowNull(false)
  @Column
  end!: string;

  @BelongsTo(() => Account, 'createdBy')
  createdByAccount!: Account;

  @Column
  @ForeignKey(() => Account)
  createdBy!: string;

  @BelongsToMany(() => Account, () => Invited)
  accounts!: Account[];
}
