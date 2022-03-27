import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
  HasMany,
  BelongsTo,
  ForeignKey,
  Unique,
  HasOne,
} from 'sequelize-typescript';
import { Event } from './Event';
import { Invited } from './Invited';
import { Notification } from './Notification';
import { Call } from './Call';
import { Address } from './Address';
import { Assigned } from './Assigned';
import { Task } from './Task';

@Table({ timestamps: false })
export class Account extends Model {
  @PrimaryKey
  @Column
  email!: string;

  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  phoneNumber!: string;

  @Unique
  @Column
  username!: string;

  @ForeignKey(() => Address)
  @Column
  addressId!: number;

  @BelongsToMany(() => Event, () => Invited)
  events!: Event[];

  @HasMany(() => Notification)
  notifications!: Notification[];

  @HasMany(() => Call)
  calls!: Call[];

  @HasOne(() => Event, 'createdBy')
  event!: Event;

  @BelongsTo(() => Address)
  address!: Address;

  @BelongsToMany(() => Task, () => Assigned)
  tasks!: Task[];

  @HasMany(() => Assigned)
  assigned!: Assigned[];
}
