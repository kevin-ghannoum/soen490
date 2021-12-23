import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Account } from './Account';
import { Project } from './Project';
import { SocialMediaPage } from './SocialMediaPage';

@Table({ timestamps: false })
export class ClientAccount extends Model {
  @BelongsTo(() => Account)
  account!: Account;

  @ForeignKey(() => Account)
  @PrimaryKey
  @Column
  email!: string;

  @AllowNull
  @Column
  businessName!: string;

  @AllowNull
  @Column
  industry!: string;

  @AllowNull
  @Column
  website!: string;

  @Default('PENDING')
  @Column(DataType.ENUM('LEAD', 'SCHEDULED', 'REJECTED', 'TO BE RESCHEDULED', 'PENDING'))
  status!: 'LEAD' | 'SCHEDULE' | 'REJECTED' | 'TO BE RESCHEDULED' | 'PENDING';

  @HasMany(() => SocialMediaPage)
  socialMediaPages!: SocialMediaPage[];

  @HasMany(() => Project)
  project!: Project[];
}
