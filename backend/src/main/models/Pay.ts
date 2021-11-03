import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { EmployeeAccount } from './EmployeeAccount';

@Table({ timestamps: false })
export class Pay extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @AllowNull(false)
  @Default(new Date())
  @Column
  issueDate!: Date;

  @AllowNull(false)
  @Column
  hoursWorked!: number;

  @Default('NOT_PAID')
  @Column(DataType.ENUM('PAID', 'NOT_PAID'))
  status!: 'PAID' | 'NOT_PAID';

  @AllowNull(false)
  @Column
  periodStart!: string;

  @AllowNull(false)
  @Column
  periodEnd!: string;

  @AllowNull(false)
  @Column
  amount!: number;

  @ForeignKey(() => EmployeeAccount)
  @Column
  email!: string;

  @BelongsTo(() => EmployeeAccount)
  employeeAccount!: EmployeeAccount;
}
