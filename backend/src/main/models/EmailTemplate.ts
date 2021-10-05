import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Business } from './Business';

@Table({ timestamps: false })
export class EmailTemplate extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  template!: string;

  @Column
  title!: string;

  @ForeignKey(() => Business)
  @Column
  businessId!: number;

  @BelongsTo(() => Business)
  business!: Business;
}
