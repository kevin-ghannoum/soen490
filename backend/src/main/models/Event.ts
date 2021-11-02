import { Table, Column, Model, PrimaryKey, BelongsToMany, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import { Account } from './Account';
import { Invited } from './Invited';

@Table({ timestamps: false })
export class Event extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  location!: string;

  @Column
  description!: string;

  @Column
  date!: Date;

  @Column
  type!: string;

  @Column
  @ForeignKey(() => Account)
  createdBy!: string;

  @BelongsToMany(() => Account, () => Invited)
  accounts!: Account[];
}
