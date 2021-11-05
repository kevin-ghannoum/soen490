import { Table, Column, Model, PrimaryKey, HasMany, AutoIncrement } from 'sequelize-typescript';
import { Account } from './Account';

@Table({ timestamps: false })
export class Address extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  civicNumber!: number;

  @Column
  streetName!: string;

  @Column
  postalCode!: string;

  @Column
  cityName!: string;

  @Column
  province!: string;

  @Column
  country!: string;

  @HasMany(() => Account)
  accounts!: Account[];
}
