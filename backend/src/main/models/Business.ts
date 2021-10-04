'use strict';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
  AutoIncrement,
} from 'sequelize-typescript';
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

  @Column
  website!: string;

  @HasMany(() => EmailTemplate)
  emailTemplate!: EmailTemplate[];

  @HasMany(() => Goal)
  goal!: Goal[];
}
