import { Model, Column, Table, ForeignKey, PrimaryKey, Default, DataType } from 'sequelize-typescript';
import { Account } from './Account';
import { Event } from './Event';

@Table({ timestamps: false })
export class Invited extends Model {
  @Default('PENDING')
  @Column(DataType.ENUM('ACCEPTED', 'REJECTED', 'PENDING'))
  status!: 'ACCEPTED' | 'REJECTED' | 'PENDING';

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;

  @ForeignKey(() => Event)
  @PrimaryKey
  @Column
  id!: number;
}
