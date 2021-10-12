import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { BusinessAccount } from './BusinessAccount';
import { EmailTemplate } from './EmailTemplate';
import { Goal } from './Goal';

@Table({ timestamps: false })
export class Business extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  industry!: string;

  @AllowNull
  @Column
  website!: string;

  @ForeignKey(() => BusinessAccount)
  email!: string;

  @HasMany(() => EmailTemplate)
  emailTemplate!: EmailTemplate[];

  @HasMany(() => Goal)
  goal!: Goal[];

  @BelongsTo(() => BusinessAccount)
  businessAccount!: BusinessAccount;
}
