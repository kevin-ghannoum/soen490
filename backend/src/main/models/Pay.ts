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
import { Col } from 'sequelize/types/lib/utils';
import { EmployeeAccount } from './EmployeeAccount';

@Table({ timestamps: false })
export class Pay extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @AllowNull(false)
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
  period!: string;

  @ForeignKey(() => EmployeeAccount)
  @Column
  email!: string;

  @BelongsTo(() => EmployeeAccount, 'email')
  employeeAccount!: EmployeeAccount;
}
