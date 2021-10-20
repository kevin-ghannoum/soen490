'use strict';
import { Table, Column, Model, PrimaryKey, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { EmployeeAccount } from './EmployeeAccount';

@Table({ timestamps: false })
export class EmployeeHoursInputType extends Model {
  @ForeignKey(() => EmployeeAccount)
  @PrimaryKey
  @Column
  email!: string;

  @Default(false)
  @Column
  automatic!: boolean;

  @Column(DataType.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
  scheduledDay!: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}
