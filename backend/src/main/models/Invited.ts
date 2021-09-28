import {Model, Column, Table, ForeignKey} from "sequelize-typescript";
import {Account} from "./Account";
import {Event} from "./Event";

@Table
export class Invited extends Model<Invited> {

  @ForeignKey(() => Account)
  @Column
  email!: string;

  @ForeignKey(() => Event)
  @Column
  id!: number;
}