import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BusinessAccount } from './BusinessAccount';
import { ClientAccount } from './ClientAccount';

@Table({ timestamps: false })
export class SocialMediaPage extends Model {
  @PrimaryKey
  @Column
  name!: string;

  @PrimaryKey
  @Column
  link!: string;

  @ForeignKey(() => ClientAccount)
  @Column
  email!: string;

  @BelongsTo(() => BusinessAccount, 'email')
  businessAccount!: BusinessAccount;
}
