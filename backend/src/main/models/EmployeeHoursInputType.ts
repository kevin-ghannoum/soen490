'use strict';
import { Table, Column, Model, PrimaryKey, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { EmployeeAccount } from './EmployeeAccount';

@Table({ timestamps: true })
export class EmployeeHoursInputType extends Model {
  @ForeignKey(() => EmployeeAccount)
  @PrimaryKey
  @Column
  email!: string;

  @Default('MANUAL')
  @Column(DataType.ENUM('MANUAL', 'AUTOMATIC'))
  inputType!: 'MANUAL' | 'AUTOMATIC';

  @Column(DataType.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
  scheduledDay!: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}
