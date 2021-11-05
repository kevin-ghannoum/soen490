import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  Default,
  DataType,
  AutoIncrement,
} from 'sequelize-typescript';
import { Business } from './Business';

@Table({ timestamps: false })
export class Goal extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  value!: number;

  @Column
  deadline!: Date;

  @Default('SALES')
  @Column(DataType.ENUM('SALES', 'EXPENSES'))
  type!: 'SALES' | 'EXPENSES';

  @ForeignKey(() => Business)
  @Column
  businessId!: number;

  @BelongsTo(() => Business)
  business!: Business;
}
