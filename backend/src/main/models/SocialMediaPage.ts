import { AllowNull, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Business } from './Business';
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
  @AllowNull
  @Column
  email!: string;

  @ForeignKey(() => Business)
  @AllowNull
  @Column
  businessId!: string;

  @BelongsTo(() => BusinessAccount, 'email')
  businessAccount!: BusinessAccount;
}
