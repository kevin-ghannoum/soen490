import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { EmployeeAccount } from './EmployeeAccount';
import { Project } from './Project';

@Table({ timestamps: false })
export class WorksOn extends Model {
  @ForeignKey(() => EmployeeAccount)
  @PrimaryKey
  @Column
  email!: string;

  @ForeignKey(() => Project)
  @PrimaryKey
  @Column
  id!: number;
}
