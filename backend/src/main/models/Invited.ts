import {Model, Column, Table, ForeignKey, PrimaryKey} from "sequelize-typescript";
import {Account} from "./Account";
import {Event} from "./Event";

@Table({timestamps:false})
export class Invited extends Model<Invited> {

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;

  @ForeignKey(() => Event)
  @PrimaryKey
  @Column
  id!: number;
}